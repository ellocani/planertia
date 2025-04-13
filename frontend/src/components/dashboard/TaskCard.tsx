import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, Plus } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TaskCard({ tasks, onAdd, onDelete, onUpdate }: any) {
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(1); 


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories/");
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0].id);
        }
      } catch (error) {
        console.error("카테고리 가져오기 실패:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>✅ 할 일 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="새 할 일을 입력하세요"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Select onValueChange={(value) => setSelectedCategory(Number(value))} defaultValue={String(selectedCategory)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: any) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => { onAdd(newTask, selectedCategory); setNewTask(""); }}>
            <Plus size={16} />
          </Button>
        </div>
        <ul className="space-y-2">
          {tasks.map((task: any) => (
            <li key={task.id} className="flex items-center space-x-2">
              {editingId === task.id ? (
                <Input value={editingText} onChange={(e) => setEditingText(e.target.value)} />
              ) : (
                <span className={`flex-grow ${task.is_completed ? "line-through text-gray-400" : ""}`}>
                  {task.title}
                </span>
              )}
              {editingId === task.id ? (
                <Button size="icon" onClick={() => { onUpdate(task.id, { ...task, title: editingText }); setEditingId(null); }}>
                  <CheckCircle size={16} />
                </Button>
              ) : (
                <Button size="icon" onClick={() => { setEditingId(task.id); setEditingText(task.title); }}>
                  <Pencil size={16} />
                </Button>
              )}
              <Button size="icon" onClick={() => onUpdate(task.id, { ...task, is_completed: !task.is_completed })}>
                <CheckCircle size={16} className={task.is_completed ? "text-green-500" : ""} />
              </Button>
              <Button size="icon" variant="destructive" onClick={() => onDelete(task.id)}>
                <Trash2 size={16} />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
