import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, PencilLine, CheckCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

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

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await axiosInstance.post("/tasks/", {
        title: newTask,
        category: 1,
        is_completed: false,
      });
      setTasks((prev) => [...prev, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("할 일 추가 실패:", error);
    }
  };

  const addMemo = async () => {
    if (!newMemo.trim()) return;
    try {
      const response = await axiosInstance.post("/memos/", {
        content: newMemo,
      });
      setMemos((prev) => [...prev, response.data]);
      setNewMemo("");
    } catch (error) {
      console.error("메모 추가 실패:", error);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const response = await axiosInstance.put(`/tasks/${task.id}/`, {
        ...task,
        is_completed: !task.is_completed,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? response.data : t))
      );
    } catch (error) {
      console.error("할 일 토글 실패:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axiosInstance.delete(`/tasks/${id}/`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("할 일 삭제 실패:", error);
    }
  };

  const deleteMemo = async (id: number) => {
    try {
      await axiosInstance.delete(`/memos/${id}/`);
      setMemos((prev) => prev.filter((memo) => memo.id !== id));
    } catch (error) {
      console.error("메모 삭제 실패:", error);
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
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? response.data : task))
      );
      setEditingTaskId(null);
      setEditingTaskText("");
    } catch (error) {
      console.error("할 일 편집 실패:", error);
    }
  };

  const saveEditingMemo = async (id: number) => {
    try {
      const memo = memos.find((memo) => memo.id === id);
      if (!memo) return;

      const response = await axiosInstance.put(`/memos/${id}/`, {
        ...memo,
        content: editingMemoText,
      });
      setMemos((prev) =>
        prev.map((memo) => (memo.id === id ? response.data : memo))
      );
      setEditingMemoId(null);
      setEditingMemoText("");
    } catch (error) {
      console.error("메모 편집 실패:", error);
    }
  };

  const iconButtonClass = "hover:text-blue-500 transition-colors";

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 캘린더 */}
        <Card>
          <CardHeader>
            <CardTitle>📅 캘린더</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar value={date} onChange={setDate} />
          </CardContent>
        </Card>

        {/* 할 일 */}
        <Card>
          <CardHeader>
            <CardTitle>📝 할 일 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="새 할 일을 입력하세요"
              />
              <Button variant="outline" onClick={addTask}>
                <Plus size={16} />
              </Button>
            </div>
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center space-x-2 border rounded p-2"
                >
                  {editingTaskId === task.id ? (
                    <Input
                      value={editingTaskText}
                      onChange={(e) => setEditingTaskText(e.target.value)}
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
                      className={iconButtonClass}
                    >
                      <CheckCircle size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingTaskId(task.id);
                        setEditingTaskText(task.title);
                      }}
                      className={iconButtonClass}
                    >
                      <PencilLine size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => toggleTask(task)}
                    className={iconButtonClass}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className={iconButtonClass}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 메모 */}
        <Card>
          <CardHeader>
            <CardTitle>🗒️ 메모 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                value={newMemo}
                onChange={(e) => setNewMemo(e.target.value)}
                placeholder="새 메모를 입력하세요"
              />
              <Button variant="outline" onClick={addMemo}>
                <Plus size={16} />
              </Button>
            </div>
            <ul className="space-y-2">
              {memos.map((memo) => (
                <li
                  key={memo.id}
                  className="flex items-center space-x-2 border rounded p-2"
                >
                  {editingMemoId === memo.id ? (
                    <Input
                      value={editingMemoText}
                      onChange={(e) => setEditingMemoText(e.target.value)}
                    />
                  ) : (
                    <span className="flex-grow">{memo.content}</span>
                  )}
                  {editingMemoId === memo.id ? (
                    <button
                      onClick={() => saveEditingMemo(memo.id)}
                      className={iconButtonClass}
                    >
                      <CheckCircle size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingMemoId(memo.id);
                        setEditingMemoText(memo.content);
                      }}
                      className={iconButtonClass}
                    >
                      <PencilLine size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMemo(memo.id)}
                    className={iconButtonClass}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
