import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background text-gray-800 px-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">Planertia</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        당신의 할 일과 메모를 한 곳에서 관리하세요
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/task")}
          className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          할 일 관리하러 가기
        </button>
        <button
          onClick={() => navigate("/memos")}
          className="bg-white border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          메모 작성하러 가기
        </button>
      </div>
    </div>
  );
}
