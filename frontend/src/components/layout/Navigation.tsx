import { Link, useNavigate } from "react-router-dom";

export default function Navigation() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center p-4 border-b bg-white shadow">
      <Link to="/" className="text-2xl font-bold text-primary">Planertia</Link>
      <nav className="flex space-x-6">
        <Link to="/dashboard" className="hover:text-primary">대시보드</Link>
        <Link to="/mypage" className="hover:text-primary">마이페이지</Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="text-red-500">로그아웃</button>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </>
        )}
      </nav>
    </header>
  );
}
