// Simple djb2-based hash fallback for non-HTTPS environments
function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0;
  }
  // Stretch to 64-char hex string
  let h = hash.toString(16).padStart(8, '0');
  return (h + h + h + h + h + h + h + h).slice(0, 64);
}

export async function hashPassword(password) {
  // Use Web Crypto if available (requires HTTPS or localhost)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (_) {
      // fall through
    }
  }
  return simpleHash(password);
}
