import { NavLink, Routes, Route } from "react-router-dom";
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ChartBarIcon,
  UserCircleIcon,
  CpuChipIcon, // for Wearables
  DocumentIcon, // for Documents
} from "@heroicons/react/24/solid";

import C1 from "./components/C1.jsx";
import C2 from "./components/C2.jsx";
import C3 from "./components/C3.jsx";
import C4 from "./components/C4.jsx";
import C5 from "./components/C5.jsx";
import C6 from "./components/C6.jsx";

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      {/* Top Nav Bar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm flex-shrink-0">
        {/* Left Tabs */}
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-1 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-gray-500 hover:text-black"
              }`
            }
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            Chat
          </NavLink>

          <NavLink
            to="/timeline"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-1 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-gray-500 hover:text-black"
              }`
            }
          >
            <ClockIcon className="w-5 h-5" />
            Timeline
          </NavLink>

          <NavLink
            to="/wearables"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-1 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-gray-500 hover:text-black"
              }`
            }
          >
            <CpuChipIcon className="w-5 h-5" />
            Wearables
          </NavLink>

          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-1 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-gray-500 hover:text-black"
              }`
            }
          >
            <DocumentIcon className="w-5 h-5" />
            Documents
          </NavLink>

          <NavLink
            to="/progress"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-1 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-gray-500 hover:text-black"
              }`
            }
          >
            <ChartBarIcon className="w-5 h-5" />
            User Progress
          </NavLink>
        </div>

        {/* Profile Tab */}
        <NavLink
          to="/user-profile"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-1 rounded-lg transition-colors duration-200 ${
              isActive
                ? "text-blue-600 bg-blue-50 font-semibold"
                : "text-gray-500 hover:text-black"
            }`
          }
        >
          <UserCircleIcon className="w-7 h-7" />
          Profile
        </NavLink>
      </nav>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<C1 />} />
          <Route path="/timeline" element={<C2 />} />
          <Route path="/wearables" element={<C3 />} />
          <Route path="/documents" element={<C4 />} />
          <Route path="/user-profile" element={<C5 />} />
          <Route path="/progress" element={<C6 />} />
        </Routes>
      </div>
    </div>
  );
}
