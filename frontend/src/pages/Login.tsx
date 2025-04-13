import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("users/login/", {
        email,
        password,
      });

      login(response.data.access, response.data.refresh);
      alert("로그인 성공!");
      navigate("/dashboard");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 실패. 이메일과 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">로그인</h1>
      <form onSubmit={handleLogin} className="space-y-4 w-72">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
