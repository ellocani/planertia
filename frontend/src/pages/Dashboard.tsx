import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard from "@/components/dashboard/TaskCard";
import MemoCard from "@/components/dashboard/MemoCard";
import CalendarCard from "@/components/dashboard/CalendarCard";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [memos, setMemos] = useState([]);
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

  const addTask = async (title: string, categoryId: number) => {
    try {
      const response = await axiosInstance.post("/tasks/", {
        title,
        category: categoryId,
        is_completed: false,
      });
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error("할 일 추가 실패:", error);
    }
  };

  const addMemo = async (content: string) => {
    try {
      const response = await axiosInstance.post("/memos/", { content });
      setMemos([...memos, response.data]);
    } catch (error) {
      console.error("메모 추가 실패:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axiosInstance.delete(`/tasks/${id}/`);
      setTasks(tasks.filter((task: any) => task.id !== id));
    } catch (error) {
      console.error("할 일 삭제 실패:", error);
    }
  };

  const deleteMemo = async (id: number) => {
    try {
      await axiosInstance.delete(`/memos/${id}/`);
      setMemos(memos.filter((memo: any) => memo.id !== id));
    } catch (error) {
      console.error("메모 삭제 실패:", error);
    }
  };

  const updateTask = async (id: number, data: any) => {
    try {
      const response = await axiosInstance.put(`/tasks/${id}/`, data);
      setTasks(tasks.map((task: any) => (task.id === id ? response.data : task)));
    } catch (error) {
      console.error("할 일 업데이트 실패:", error);
    }
  };

  const updateMemo = async (id: number, data: any) => {
    try {
      const response = await axiosInstance.put(`/memos/${id}/`, data);
      setMemos(memos.map((memo: any) => (memo.id === id ? response.data : memo)));
    } catch (error) {
      console.error("메모 업데이트 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CalendarCard date={date} setDate={setDate} />
            <TaskCard tasks={tasks} onAdd={addTask} onDelete={deleteTask} onUpdate={updateTask} />
            <MemoCard memos={memos} onAdd={addMemo} onDelete={deleteMemo} onUpdate={updateMemo} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
