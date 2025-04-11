import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Task {
  id: number;
  title: string;
  is_completed: boolean;
}

interface Memo {
  id: number;
  content: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newMemo, setNewMemo] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const [editingMemoText, setEditingMemoText] = useState("");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
    fetchMemos();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks/");
      setTasks(response.data);
    } catch (error) {
      console.error("할 일 가져오기 실패:", error);
    }
  };

  const fetchMemos = async () => {
    try {
      const response = await axiosInstance.get("/memos/");
      setMemos(response.data);
    } catch (error) {
      console.error("메모 가져오기 실패:", error);
    }
  };

  // 할 일 추가
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

  // 메모 추가
  const addMemo = async () => {
    if (newMemo.trim() === "") return;
    try {
      const response = await axiosInstance.post("/memos/", {
        content: newMemo,
      });
      setMemos([...memos, response.data]);
      setNewMemo("");
    } catch (error) {
      console.error("메모 추가 실패:", error);
    }
  };

  // 할 일 완료 토글
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

  // 할 일 삭제
  const deleteTask = async (id: number) => {
    try {
      await axiosInstance.delete(`/tasks/${id}/`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("할 일 삭제 실패:", error);
    }
  };

  // 메모 삭제
  const deleteMemo = async (id: number) => {
    try {
      await axiosInstance.delete(`/memos/${id}/`);
      setMemos(memos.filter((memo) => memo.id !== id));
    } catch (error) {
      console.error("메모 삭제 실패:", error);
    }
  };

  // 할 일 편집 저장
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

  // 메모 편집 저장
  const saveEditingMemo = async (id: number) => {
    try {
      const memo = memos.find((memo) => memo.id === id);
      if (!memo) return;

      const response = await axiosInstance.put(`/memos/${id}/`, {
        ...memo,
        content: editingMemoText,
      });
      setMemos(memos.map((m) => (m.id === id ? response.data : m)));
      setEditingMemoId(null);
      setEditingMemoText("");
    } catch (error) {
      console.error("메모 편집 실패:", error);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 캘린더 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">📅 캘린더</h2>
          <Calendar onChange={setDate} value={date} />
        </div>

        {/* 할 일 관리 */}
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

        {/* 메모 관리 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">🗒️ 메모 관리</h2>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newMemo}
              onChange={(e) => setNewMemo(e.target.value)}
              placeholder="새 메모를 입력하세요"
              className="border rounded-md p-2 flex-grow"
            />
            <button
              onClick={addMemo}
              className="bg-blue-500 text-white px-4 rounded-md hover:bg-blue-600"
            >
              추가
            </button>
          </div>
          <ul className="space-y-2">
            {memos.map((memo) => (
              <li key={memo.id} className="flex items-center space-x-2">
                {editingMemoId === memo.id ? (
                  <input
                    type="text"
                    value={editingMemoText}
                    onChange={(e) => setEditingMemoText(e.target.value)}
                    className="border rounded p-1 flex-grow"
                  />
                ) : (
                  <span className="flex-grow">{memo.content}</span>
                )}
                {editingMemoId === memo.id ? (
                  <button
                    onClick={() => saveEditingMemo(memo.id)}
                    className="bg-green-500 text-white px-2 rounded"
                  >
                    저장
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingMemoId(memo.id);
                      setEditingMemoText(memo.content);
                    }}
                    className="bg-yellow-400 text-white px-2 rounded"
                  >
                    편집
                  </button>
                )}
                <button
                  onClick={() => deleteMemo(memo.id)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
