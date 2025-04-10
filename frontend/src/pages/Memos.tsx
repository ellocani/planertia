import { useState } from "react";

export default function Memos() {
  const [memos, setMemos] = useState([
    { id: 1, content: "회의 요약 정리" },
    { id: 2, content: "오늘 할 일 캘린더에 추가" },
  ]);

  const [newMemo, setNewMemo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const addMemo = () => {
    if (newMemo.trim() === "") return;
    const newMemoObj = {
      id: Date.now(),
      content: newMemo,
    };
    setMemos((prev) => [...prev, newMemoObj]);
    setNewMemo("");
  };

  const deleteMemo = (id: number) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id));
  };

  const startEditing = (memo: { id: number; content: string }) => {
    setEditingId(memo.id);
    setEditingText(memo.content);
  };

  const saveEditing = (id: number) => {
    setMemos((prev) =>
      prev.map((memo) =>
        memo.id === id ? { ...memo, content: editingText } : memo
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">메모 📒</h1>

      {/* 메모 추가 */}
      <div className="flex space-x-2">
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
          +
        </button>
      </div>

      {/* 메모 목록 */}
      <ul className="space-y-3">
        {memos.map((memo) => (
          <li
            key={memo.id}
            className="flex items-center justify-between p-4 rounded-md border bg-white"
          >
            <div className="flex items-center space-x-3 flex-grow">
              {editingId === memo.id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="border rounded p-1 flex-grow"
                />
              ) : (
                <span>{memo.content}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {editingId === memo.id ? (
                <button
                  onClick={() => saveEditing(memo.id)}
                  className="text-sm bg-green-500 text-white px-2 py-1 rounded"
                >
                  저장
                </button>
              ) : (
                <button
                  onClick={() => startEditing(memo)}
                  className="text-sm bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  편집
                </button>
              )}
              <button
                onClick={() => deleteMemo(memo.id)}
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
