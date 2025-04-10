import { useNavigate } from "react-router-dom";
import Card from "@/components/common/Card";

export default function Home() {
  const navigate = useNavigate(); // ✅ 라우터 이동 훅

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Planertia에 오신 걸 환영합니다 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="오늘 할 일">
          <button
            onClick={() => navigate("/task")}
            className="text-blue-500 hover:underline"
          >
            오늘은 3개의 할 일이 있습니다.
          </button>
        </Card>

        <Card title="메모">
          <button
            onClick={() => navigate("/memos")}
            className="text-blue-500 hover:underline"
          >
            최근 메모 2개를 확인하세요.
          </button>
        </Card>

        <Card title="캘린더">
          <button
            onClick={() => navigate("/category")}
            className="text-blue-500 hover:underline"
          >
            이번 주 일정을 한 눈에 확인하세요.
          </button>
        </Card>
      </div>
    </div>
  );
}
