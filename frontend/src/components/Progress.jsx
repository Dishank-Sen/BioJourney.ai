import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ef4444", // red
  "#14b8a6"  // teal
];


export default function Progress({ data }) {
  const {
    totalConversation,
    participants,
    weeklyProgress,
    monthlyProgress,
    concerns,
    sleepConcerns,
  } = data;

  const pieData = participants.map((p) => ({
    name: p.name,
    value: p.value,
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">User Progress</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Spent */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-3">Total Conversations</h2>
          <div className="flex items-center justify-between">
            <div className="w-40 h-40">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center ml-[-100px]">
              <p className="text-2xl font-bold">{totalConversation}</p>
              <p className="text-gray-500 text-sm">Conversation</p>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            {participants.map((p, i) => (
              <div key={i} className="flex items-center space-x-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                ></span>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Improvements */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-3">Improvements</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-xl p-3">
              <p className="text-sm text-gray-500">Weekly Progress</p>
              <p className="text-xl font-bold text-blue-600">
                +{weeklyProgress}%
              </p>
            </div>
            <div className="border rounded-xl p-3">
              <p className="text-sm text-gray-500">Monthly Progress</p>
              <p className="text-xl font-bold text-green-600">
                +{monthlyProgress}%
              </p>
            </div>
          </div>
        </div>

        {/* Concerns */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-3">Concerns</h2>
          <div className="space-y-3">
            {concerns.map((c, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm flex items-center space-x-3 ${
                  c.type === "warning"
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <span className="text-red-500">⚠️</span>
                <div>
                  <p className="font-medium">{c.message}</p>
                  <p className="text-xs text-gray-500">{c.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sleep Concerns */}
      <div className="mt-6 bg-white p-5 rounded-2xl shadow-sm">
        <h2 className="font-semibold mb-3">Concerns</h2>
        <div className="grid grid-cols-2 gap-4">
          {sleepConcerns.map((c, i) => (
            <div
              key={i}
              className="p-3 border rounded-xl text-sm bg-yellow-50 border-yellow-200"
            >
              <p className="font-medium">{c.message}</p>
              <p className="text-xs text-gray-500">{c.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
