import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Planertia
        </Link>
        <nav className="space-x-4">
          <Link to="/login" className="text-gray-700 hover:text-black">
            로그인
          </Link>
          <Link to="/signup" className="text-gray-700 hover:text-black">
            회원가입
          </Link>
        </nav>
      </div>
    </header>
  );
}