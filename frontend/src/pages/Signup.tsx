import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axiosInstance.post("users/signup/", {
        email,
        username,
        password,
      });
      alert("회원가입 성공! 로그인 해주세요.");
      navigate("/login");
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "회원가입 실패. 입력 정보를 다시 확인해주세요."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      <form onSubmit={handleSignup} className="space-y-4 w-72">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="사용자명"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
