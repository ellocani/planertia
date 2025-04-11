import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface Task {
  id: number;
  title: string;
  is_completed: boolean;
}

export default function TaskCard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks/");
      setTasks(response.data);
    } catch (error) {
      console.error("할 일 가져오기 실패:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;
    try {
      const response = await axiosInstance.post("/tasks/", {
        title: newTask,
        category: 1,
        is_completed: false,
      });
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("할 일 추가 실패:", error);
    }
  };

  const saveEditingTask = async (id: number) => {
    try {
      const task = tasks.find((task) => task.id === id);
      if (!task) return;

      const response = await axiosInstance.put(`/tasks/${id}/`, {
        ...task,
        title: editingTaskText,
      });
      setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
      setEditingTaskId(null);
      setEditingTaskText("");
    } catch (error) {
      console.error("할 일 편집 실패:", error);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const response = await axiosInstance.put(`/tasks/${task.id}/`, {
        ...task,
        is_completed: !task.is_completed,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
    } catch (error) {
      console.error("할 일 토글 실패:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axiosInstance.delete(`/tasks/${id}/`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("할 일 삭제 실패:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">📝 할 일 관리</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="새 할 일을 입력하세요"
          className="border rounded-md p-2 flex-grow"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 rounded-md hover:bg-blue-600"
        >
          추가
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center space-x-2">
            {editingTaskId === task.id ? (
              <input
                type="text"
                value={editingTaskText}
                onChange={(e) => setEditingTaskText(e.target.value)}
                className="border rounded p-1 flex-grow"
              />
            ) : (
              <span
                className={`flex-grow ${
                  task.is_completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </span>
            )}
            {editingTaskId === task.id ? (
              <button
                onClick={() => saveEditingTask(task.id)}
                className="bg-green-500 text-white px-2 rounded"
              >
                저장
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingTaskId(task.id);
                  setEditingTaskText(task.title);
                }}
                className="bg-yellow-400 text-white px-2 rounded"
              >
                편집
              </button>
            )}
            <button
              onClick={() => toggleTask(task)}
              className="bg-gray-400 text-white px-2 rounded"
            >
              {task.is_completed ? "복구" : "완료"}
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="bg-red-500 text-white px-2 rounded"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
