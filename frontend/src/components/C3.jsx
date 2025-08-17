// src/components/C3.jsx
import React from "react";

export default function C3() {
  // Example mock data (later replace with real wearable API or Advik's JSON)
  const wearableData = [
    {
      date: "2025-08-15",
      sleep: "6h 45m",
      recovery: "72%",
      hrv: "58 ms",
      stress: "Moderate",
    },
    {
      date: "2025-08-14",
      sleep: "7h 20m",
      recovery: "80%",
      hrv: "64 ms",
      stress: "Low",
    },
    {
      date: "2025-08-13",
      sleep: "5h 55m",
      recovery: "60%",
      hrv: "42 ms",
      stress: "High",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Daily Wearable Stats
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 border-b">Date</th>
              <th className="px-6 py-3 border-b">Sleep</th>
              <th className="px-6 py-3 border-b">Recovery</th>
              <th className="px-6 py-3 border-b">HRV</th>
              <th className="px-6 py-3 border-b">Stress</th>
            </tr>
          </thead>
          <tbody className="text-center text-gray-800">
            {wearableData.map((entry, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors text-sm"
              >
                <td className="px-6 py-3 border-b">{entry.date}</td>
                <td className="px-6 py-3 border-b">{entry.sleep}</td>
                <td className="px-6 py-3 border-b">{entry.recovery}</td>
                <td className="px-6 py-3 border-b">{entry.hrv}</td>
                <td className="px-6 py-3 border-b">{entry.stress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
