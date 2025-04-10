import { useState } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "React Hooks 공부", completed: false },
    { id: 2, title: "프론트엔드 폴더 정리", completed: true },
    { id: 3, title: "기획 문서 작성", completed: false },
  ]);

  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  // 할 일 추가
  const addTask = () => {
    if (newTask.trim() === "") return;
    const newTaskObj = {
      id: Date.now(),
      title: newTask,
      completed: false,
    };
    setTasks((prev) => [...prev, newTaskObj]);
    setNewTask("");
  };

  // 완료 토글
  const toggleTask = (id: number) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    const sorted = [
      ...updated.filter((task) => !task.completed),
      ...updated.filter((task) => task.completed),
    ];

    setTasks(sorted);
  };

  // 삭제
  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // 편집 모드 활성화
  const startEditing = (task: { id: number; title: string }) => {
    setEditingId(task.id);
    setEditingText(task.title);
  };

  // 편집 저장
  const saveEditing = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title: editingText } : task
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">오늘의 할 일 ✅</h1>

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
              task.completed
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
                onClick={() => toggleTask(task.id)}
                className={`text-sm px-2 py-1 rounded ${
                  task.completed
                    ? "bg-gray-400 text-white"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {task.completed ? "완료됨" : "완료"}
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
