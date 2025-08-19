import React, { useEffect, useState } from "react";
import Progress from "./Progress.jsx";

const initialMetricData = {
  totalConversation: 5,
  participants: [
    { name: "Ruby", value: 20 },
    { name: "Dr. Warren", value: 30 },
    { name: "Advik", value: 25 },
    { name: "Carla", value: 25 },
  ],
  weeklyProgress: 8,
  monthlyProgress: 15,
  concerns: [
    { message: "Missed 3 of 5 planned workouts", type: "error", status: "worsening" },
    { message: "Blood glucose 5% higher than last month", type: "warning", status: "worsening" },
  ],
  sleepConcerns: [
    { message: "Vantage sleep was 5h 40m (goal: 7h)", status: "worsening" },
    { message: "Average sleep was 5m this month", status: "worsening" },
  ],
};

export default function C6() {
  const [userId] = useState("68a1ca9892c8c177a63ee0d0");
  const [metrics, setMetrics] = useState(initialMetricData);

  useEffect(() => {
    const getConversationCount = async (userId) => {
      try {
        const res = await fetch(`https://${import.meta.env.VITE_EC2_ENDPOINT}/api/getConversationCount`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ userId })
        });

        if (res.ok) {
          const data = await res.json();
          console.log("API response:", data);

          setMetrics((prev) => ({
            participants: data.count,        // count is already an array of {name, value}
            totalConversation: data.totalCount
          }));
        } else {
          console.log("Some error occurred");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    getConversationCount(userId);
  }, [userId]);

  return (
    <div className="p-6 flex items-center justify-center h-full">
      <div className="text-center text-gray-500">
        <h2 className="text-xl font-semibold">User Progress</h2>
        <Progress data={metrics} />
      </div>
    </div>
  );
}
