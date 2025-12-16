import { useEffect, useState } from "react";
import { getTasks, addTask, deleteTask } from "./api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    setTasks(await getTasks());
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return alert("Enter task");
    await addTask(title);
    setTitle("");
    loadTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          📝 Task Manager
        </h1>

        {/* Input */}
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

        {/* Tasks */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-gray-500">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-center text-gray-400">
              No tasks yet ✨
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-xl hover:shadow-md transition"
              >
                <span className="text-gray-700 font-medium">
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(task._id).then(loadTasks)}
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
