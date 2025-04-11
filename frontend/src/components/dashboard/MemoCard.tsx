import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface Memo {
  id: number;
  content: string;
}

export default function MemoCard() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemo, setNewMemo] = useState("");
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const [editingMemoText, setEditingMemoText] = useState("");

  useEffect(() => {
    fetchMemos();
  }, []);

  const fetchMemos = async () => {
    try {
      const response = await axiosInstance.get("/memos/");
      setMemos(response.data);
    } catch (error) {
      console.error("메모 가져오기 실패:", error);
    }
  };

  const addMemo = async () => {
    if (newMemo.trim() === "") return;
    try {
      const response = await axiosInstance.post("/memos/", { content: newMemo });
      setMemos((prev) => [...prev, response.data]);
      setNewMemo("");
    } catch (error) {
      console.error("메모 추가 실패:", error);
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
      setMemos(memos.map((m) => (m.id === id ? response.data : m)));
      setEditingMemoId(null);
      setEditingMemoText("");
    } catch (error) {
      console.error("메모 편집 실패:", error);
    }
  };

  const deleteMemo = async (id: number) => {
    try {
      await axiosInstance.delete(`/memos/${id}/`);
      setMemos(memos.filter((memo) => memo.id !== id));
    } catch (error) {
      console.error("메모 삭제 실패:", error);
    }
  };

  return (
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
  );
}
