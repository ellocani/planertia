// src/pages/Home.tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Planertia</h1>
      <p className="text-gray-600 mb-8">나의 일상을 기록하고, 함께 성장하는 서비스</p>
      <div className="flex space-x-4">
        <Button>로그인</Button>
        <Button variant="outline">회원가입</Button>
      </div>
    </div>
  );
}
