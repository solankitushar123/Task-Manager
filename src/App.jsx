import { useEffect, useState } from "react";
import { getTasks, addTask, deleteTask } from "./api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      alert("Failed to load tasks. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return alert("Enter task");

    try {
      const newTask = await addTask(title);
      if (!newTask) throw new Error("Add task failed");

      // Append new task smoothly
      setTasks((prev) => [...prev, newTask]);
      setTitle("");
    } catch (error) {
      alert("Failed to submit task. Please try again later.");
    }
  };

  const handleDelete = async (id) => {
    // Fade-out effect
    setTasks((prev) =>
      prev.map((task) => (task._id === id ? { ...task, removing: true } : task))
    );

    try {
      // Wait for fade-out animation
      setTimeout(async () => {
        const success = await deleteTask(id);
        if (success === false) throw new Error("Delete failed");

        setTasks((prev) => prev.filter((task) => task._id !== id));
      }, 200);
    } catch (error) {
      alert("Failed to delete task. Please try again later.");
      // Revert removing effect if deletion fails
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? { ...task, removing: false } : task))
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          📝 Task Manager
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAdd}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-95 transition"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-gray-500">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-center text-gray-400">No tasks yet ✨</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className={`flex items-center justify-between bg-gray-100 px-4 py-3 rounded-xl hover:shadow-md transition-opacity duration-200 ${
                  task.removing ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className="text-gray-700 font-medium">{task.title}</span>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  ✖
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
