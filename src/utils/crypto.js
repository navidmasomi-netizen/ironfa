const PASSWORD_SCHEME = "pbkdf2-sha256";
const PASSWORD_VERSION = "v1";
const PBKDF2_ITERATIONS = 210000;
const SALT_BYTES = 16;

function hasSecureCrypto() {
  return typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined" && typeof crypto.getRandomValues === "function";
}

function bytesToHex(bytes) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex) {
  if (!hex || hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const value = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(value)) return null;
    bytes[i] = value;
  }
  return bytes;
}

// Legacy insecure fallback kept only for compatibility with existing accounts.
function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0;
  }
  const h = hash.toString(16).padStart(8, "0");
  return (h + h + h + h + h + h + h + h).slice(0, 64);
}

async function sha256Hex(value) {
  if (!hasSecureCrypto()) return null;
  const msgBuffer = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return bytesToHex(new Uint8Array(hashBuffer));
}

async function derivePbkdf2Hex(password, saltBytes, iterations = PBKDF2_ITERATIONS) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  return bytesToHex(new Uint8Array(derivedBits));
}

function parsePasswordHash(storedHash) {
  if (typeof storedHash !== "string") return null;
  const [scheme, version, iterationsRaw, saltHex, digestHex] = storedHash.split("$");
  const iterations = Number.parseInt(iterationsRaw, 10);
  if (
    scheme !== PASSWORD_SCHEME ||
    version !== PASSWORD_VERSION ||
    !Number.isFinite(iterations) ||
    !saltHex ||
    !digestHex
  ) {
    return null;
  }
  const salt = hexToBytes(saltHex);
  if (!salt) return null;
  return { iterations, salt, digestHex };
}

export function needsPasswordUpgrade(storedHash) {
  return !parsePasswordHash(storedHash);
}

export async function hashPassword(password) {
  if (!hasSecureCrypto()) {
    // HTTP previews on local networks (for example mobile device testing) do not
    // expose Web Crypto in all browsers. Keep signup/login usable there with a
    // legacy fallback; successful logins in secure contexts are upgraded later.
    return simpleHash(password);
  }

  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const digestHex = await derivePbkdf2Hex(password, salt, PBKDF2_ITERATIONS);
  return [PASSWORD_SCHEME, PASSWORD_VERSION, String(PBKDF2_ITERATIONS), bytesToHex(salt), digestHex].join("$");
}

export async function verifyPassword(password, storedHash) {
  const parsed = parsePasswordHash(storedHash);
  if (parsed) {
    if (!hasSecureCrypto()) {
      throw new Error("secure_crypto_unavailable");
    }
    const digestHex = await derivePbkdf2Hex(password, parsed.salt, parsed.iterations);
    return digestHex === parsed.digestHex;
  }

  const legacySha256 = await sha256Hex(password);
  if (legacySha256 && legacySha256 === storedHash) return true;
  return simpleHash(password) === storedHash;
}
