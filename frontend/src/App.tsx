import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Mypage from "@/pages/Mypage";
import Categories from "@/pages/Categories";
import Memos from "@/pages/Memos";
import Tasks from "@/pages/Tasks";
import Dashboard from "@/pages/Dashboard"; // 추가!

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/category" element={<Categories />} />
          <Route path="/memos" element={<Memos />} />
          <Route path="/task" element={<Tasks />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
