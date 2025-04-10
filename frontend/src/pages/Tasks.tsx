import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface Task {
  id: number;
  title: string;
  is_completed: boolean;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  // 할 일 가져오기
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

  // 할 일 추가
  const addTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const response = await axiosInstance.post("/tasks/", {
        title: newTask,
        category: 1, // 현재 카테고리 고정
        is_completed: false, // 필드명 수정
      });
      setTasks((prev) => [...prev, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("할 일 추가 실패:", error);
    }
  };

  // 완료 토글
  const toggleTask = async (task: Task) => {
    try {
      const response = await axiosInstance.put(`/tasks/${task.id}/`, {
        ...task,
        is_completed: !task.is_completed,
      });

      const updatedTasks = tasks.map((t) =>
        t.id === task.id ? response.data : t
      );

      const sorted = [
        ...updatedTasks.filter((task) => !task.is_completed),
        ...updatedTasks.filter((task) => task.is_completed),
      ];

      setTasks(sorted);
    } catch (error) {
      console.error("할 일 토글 실패:", error);
    }
  };

  // 삭제
  const deleteTask = async (id: number) => {
    try {
      await axiosInstance.delete(`/tasks/${id}/`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("할 일 삭제 실패:", error);
    }
  };

  // 편집 모드 활성화
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingText(task.title);
  };

  // 편집 저장
  const saveEditing = async (id: number) => {
    try {
      const task = tasks.find((task) => task.id === id);
      if (!task) return;

      const response = await axiosInstance.put(`/tasks/${id}/`, {
        ...task,
        title: editingText,
      });

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? response.data : task))
      );
      setEditingId(null);
      setEditingText("");
    } catch (error) {
      console.error("편집 저장 실패:", error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">오늘의 할 일</h1>

      {/* 할 일 추가 */}
      <div className="flex space-x-2">
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
          +
        </button>
      </div>

      {/* 할 일 목록 */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-md border transition ${
              task.is_completed
                ? "bg-gray-100 text-gray-400 opacity-60"
                : "bg-white"
            }`}
          >
            <div className="flex items-center space-x-3 flex-grow">
              {editingId === task.id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="border rounded p-1 flex-grow"
                />
              ) : (
                <span>{task.title}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {editingId === task.id ? (
                <button
                  onClick={() => saveEditing(task.id)}
                  className="text-sm bg-green-500 text-white px-2 py-1 rounded"
                >
                  저장
                </button>
              ) : (
                <button
                  onClick={() => startEditing(task)}
                  className="text-sm bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  편집
                </button>
              )}
              <button
                onClick={() => toggleTask(task)}
                className={`text-sm px-2 py-1 rounded ${
                  task.is_completed
                    ? "bg-gray-400 text-white"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {task.is_completed ? "완료됨" : "완료"}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
