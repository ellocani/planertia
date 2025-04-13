import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle } from "lucide-react";

export default function MemoCard({ memos, onAdd, onDelete, onUpdate }: any) {
  const [newMemo, setNewMemo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>📝 메모 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="새 메모를 입력하세요"
            value={newMemo}
            onChange={(e) => setNewMemo(e.target.value)}
          />
          <Button onClick={() => { onAdd(newMemo); setNewMemo(""); }}>+</Button>
        </div>
        <ul className="space-y-2">
          {memos.map((memo: any) => (
            <li key={memo.id} className="flex items-center space-x-2">
              {editingId === memo.id ? (
                <Input value={editingText} onChange={(e) => setEditingText(e.target.value)} />
              ) : (
                <span className="flex-grow">{memo.content}</span>
              )}
              {editingId === memo.id ? (
                <Button size="icon" onClick={() => { onUpdate(memo.id, { ...memo, content: editingText }); setEditingId(null); }}>
                  <CheckCircle size={16} />
                </Button>
              ) : (
                <Button size="icon" onClick={() => { setEditingId(memo.id); setEditingText(memo.content); }}>
                  <Pencil size={16} />
                </Button>
              )}
              <Button size="icon" variant="destructive" onClick={() => onDelete(memo.id)}>
                <Trash2 size={16} />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
