// src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const [date, setDate] = useState<Date | undefined>(new Date());

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

  const toggleTaskCompletion = async (task: Task) => {
    try {
      const response = await axiosInstance.put(`/tasks/${task.id}/`, {
        ...task,
        is_completed: !task.is_completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? response.data : t)));
    } catch (error) {
      console.error("완료 토글 실패:", error);
    }
  };

  // 드래그 앤 드롭 이벤트
  const handleDragEnd = (event: any, type: "task" | "memo") => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      if (type === "task") {
        const oldIndex = tasks.findIndex((task) => task.id === active.id);
        const newIndex = tasks.findIndex((task) => task.id === over.id);
        setTasks(arrayMove(tasks, oldIndex, newIndex));
      } else if (type === "memo") {
        const oldIndex = memos.findIndex((memo) => memo.id === active.id);
        const newIndex = memos.findIndex((memo) => memo.id === over.id);
        setMemos(arrayMove(memos, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className="p-8 space-y-8 bg-muted min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 캘린더 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📅 캘린더
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </CardContent>
        </Card>

        {/* 할 일 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📝 할 일 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                placeholder="새 할 일을 입력하세요"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <Button onClick={addTask}>추가</Button>
            </div>
            <DndContext collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, "task")}>
              <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                  <SortableItem
                    key={task.id}
                    id={task.id}
                    content={task.title}
                    completed={task.is_completed}
                    onDelete={() => deleteTask(task.id)}
                    onToggle={() => toggleTaskCompletion(task)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>

        {/* 메모 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🗒️ 메모 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                placeholder="새 메모를 입력하세요"
                value={newMemo}
                onChange={(e) => setNewMemo(e.target.value)}
              />
              <Button onClick={addMemo}>추가</Button>
            </div>
            <DndContext collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, "memo")}>
              <SortableContext items={memos.map((memo) => memo.id)} strategy={verticalListSortingStrategy}>
                {memos.map((memo) => (
                  <SortableItem
                    key={memo.id}
                    id={memo.id}
                    content={memo.content}
                    onDelete={() => deleteMemo(memo.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 드래그 가능한 공통 아이템 컴포넌트
function SortableItem({
  id,
  content,
  completed,
  onDelete,
  onToggle,
}: {
  id: number;
  content: string;
  completed?: boolean;
  onDelete: () => void;
  onToggle?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center mb-2 bg-white p-2 rounded shadow">
      <div {...attributes} {...listeners} className="cursor-grab mr-2 text-gray-400">
        <GripVertical size={18} />
      </div>
      <span className={`flex-grow ${completed ? "line-through text-gray-400" : ""}`}>{content}</span>
      {onToggle && (
        <Button variant="secondary" size="sm" onClick={onToggle} className="mr-2">
          {completed ? "복구" : "완료"}
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={onDelete}>
        삭제
      </Button>
    </div>
  );
}
