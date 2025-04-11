import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

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
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

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

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 캘린더 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">📅 캘린더</h2>
          <Calendar onChange={setDate} value={date} />
        </div>

        {/* 할 일 요약 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">📝 할 일 요약</h2>
          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <li
                  key={task.id}
                  className={`p-2 rounded ${
                    task.is_completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">등록된 할 일이 없습니다.</p>
          )}
          <button
            onClick={() => navigate("/task")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            할 일 관리
          </button>
        </div>

        {/* 메모 요약 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">🗒️ 메모 요약</h2>
          {memos.length > 0 ? (
            <ul className="space-y-2">
              {memos.slice(0, 5).map((memo) => (
                <li key={memo.id} className="p-2 rounded text-gray-800">
                  {memo.content}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">등록된 메모가 없습니다.</p>
          )}
          <button
            onClick={() => navigate("/memos")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            메모 작성
          </button>
        </div>
      </div>
    </div>
  );
}
