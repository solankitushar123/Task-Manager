const API_URL = import.meta.env.VITE_API_URL;

export const getTasks = async () =>
  fetch(API_URL).then((res) => res.json());

export const addTask = async (title) =>
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  }).then((res) => res.json());

export const deleteTask = async (id) =>
  fetch(`${API_URL}/${id}`, { method: "DELETE" });

