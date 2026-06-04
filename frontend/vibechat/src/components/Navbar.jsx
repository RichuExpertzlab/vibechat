import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, MessageCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="h-16 bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center px-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
          <MessageCircle size={26} />
        </div>
        <h1 className="text-2xl font-bold">VibeChat</h1>
      </div>

      {user && (
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm font-medium">Hi, {user.name}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}