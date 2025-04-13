import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    alert("로그아웃 되었습니다.");
    navigate("/login"); // 로그아웃 후 바로 로그인 페이지로 이동
    window.location.reload(); // 상태 및 화면 강제 초기화
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Planertia
        </Link>
        <nav className="flex space-x-6 text-gray-700">
          {isLoggedIn && <Link to="/dashboard">대시보드</Link>}
          {isLoggedIn && <Link to="/mypage">마이페이지</Link>}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-red-500">
              로그아웃
            </button>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/signup">회원가입</Link>
            </>
          )}
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
