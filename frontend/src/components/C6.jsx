// src/components/C6.jsx
import React from "react";
import { useEffect, useState } from "react";
import Progress from "./Progress.jsx";

let metricData = {
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
  const [userId, setUserId] = useState("68a1ca9892c8c177a63ee0d0");

  useEffect(() => {
    const getConversationCount = async (userId) => {
      const res = await fetch(`https://${import.meta.env.VITE_EC2_ENDPOINT}/api/getConversationCount`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json"
        },
        body: JSON.stringify({userId})
      })

      if(res.ok){
        const data = await res.json();
        metricData.participants = data.count;
        metricData.totalConversation = data.totalCount;
      }else{
        console.log("some error occured")
      }
    }

    getConversationCount(userId);
  }, [])

  return (
    <div className="p-6 flex items-center justify-center h-full">
      <div className="text-center text-gray-500">
        <h2 className="text-xl font-semibold">User Progress</h2>
        <Progress data={metricData}/>
      </div>
    </div>
  );
}