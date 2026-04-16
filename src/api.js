const API_URL = "http://localhost:3001/api";

export async function registerUser(email, name, password) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password }),
  });
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getWorkouts(userId) {
  const res = await fetch(`${API_URL}/workouts?userId=${userId}`);
  return res.json();
}

export async function createWorkout(title, userId) {
  const res = await fetch(`${API_URL}/workouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, userId }),
  });
  return res.json();
}
