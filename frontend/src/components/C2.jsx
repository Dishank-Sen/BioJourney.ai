import React, { useState, useRef } from "react";

const journeyEventsSeed = [
  { id: 1, title: "MRI Scan", icon: "📄", suggestedBy: "Dr. Warren", reason: "Baseline MRI scan to check cardiovascular health." },
  { id: 2, title: "Magnesium Added", icon: "💊", suggestedBy: "Dr. Warren", reason: "Rohan's magnesium levels are suboptimal, contributing to cramps. Magnesium added to supplements." },
  { id: 3, title: "Exercise Change", icon: "🏃‍♂️", suggestedBy: "Dr. Warren", reason: "Adjusted exercise routine to reduce joint strain." },
  { id: 4, title: "Diet Change", icon: "🍎", suggestedBy: "Dr. Warren", reason: "Increased fiber and reduced sugar for gut health." },
  { id: 5, title: "HRV Drop", icon: "📉", suggestedBy: "Advik", reason: "Stress detected in HRV data, adjusted sleep protocol." },
  { id: 6, title: "Sleep Protocol", icon: "😴", suggestedBy: "Dr. Warren", reason: "Improved sleep hygiene with melatonin and schedule changes." },
  { id: 7, title: "Diet Tracking", icon: "🥗", suggestedBy: "Nutritionist", reason: "Daily diet tracking to monitor calorie intake." },
  { id: 8, title: "Blood Test", icon: "🩸", suggestedBy: "Dr. Warren", reason: "Blood test to monitor vitamin D and iron levels." },
  { id: 9, title: "Yoga Added", icon: "🧘", suggestedBy: "Trainer", reason: "Added yoga sessions to improve flexibility and reduce stress." },
];

const currentPlan = {
  medication: ["Magnesium 250mg daily", "Vitamin D3 1000 IU", "Omega-3 Fish Oil"],
  exercises: ["30 min cardio (5x week)", "Yoga (2x week)", "Strength training (3x week)"],
  wearables: ["Apple Watch for HRV", "Oura Ring for sleep", "Continuous glucose monitor"],
  diet: ["High-protein breakfast", "Low-carb lunch", "Fiber-rich dinner", "Daily hydration goal: 3L"],
};

export default function C2() {
  const [activeId, setActiveId] = useState(journeyEventsSeed[0].id);
  const [activeTab, setActiveTab] = useState("journey");
  const scrollerRef = useRef(null);

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("journey")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "journey"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          User Journey
        </button>
        <button
          onClick={() => setActiveTab("plan")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "plan"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Current Plan
        </button>
      </div>

      {/* User Journey Section */}
      {activeTab === "journey" && (
        <>
          {/* Scrollable timeline */}
          <div
            ref={scrollerRef}
            className="overflow-x-auto pb-6 custom-scrollbar"
          >
            <div className="flex items-center gap-8 min-w-max px-4">
              {journeyEventsSeed.map((event, index) => (
                <React.Fragment key={event.id}>
                  <div
                    className={`flex flex-col items-center cursor-pointer ${
                      activeId === event.id ? "text-blue-600" : "text-gray-600"
                    }`}
                    onClick={() => setActiveId(event.id)}
                  >
                    <div
                      className={`flex items-center justify-center w-20 h-20 rounded-full border-2 ${
                        activeId === event.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <span className="text-3xl">{event.icon}</span>
                    </div>
                    <span className="mt-2 text-sm font-medium text-center whitespace-nowrap">
                      {event.title}
                    </span>
                  </div>

                  {/* connector line except last */}
                  {index < journeyEventsSeed.length - 1 && (
                    <div className="w-20 h-0.5 bg-gray-300" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Detail box */}
          <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
            {(() => {
              const activeEvent = journeyEventsSeed.find(
                (e) => e.id === activeId
              );
              if (!activeEvent) return null;
              return (
                <>
                  <h3 className="text-lg font-semibold">
                    {activeEvent.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Suggested by{" "}
                    <span className="font-medium">
                      {activeEvent.suggestedBy}
                    </span>
                  </p>
                  <p className="mt-2 text-gray-700">{activeEvent.reason}</p>
                </>
              );
            })()}
          </div>
        </>
      )}

      {/* Current Plan Section */}
      {activeTab === "plan" && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medication */}
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2">💊 Medication</h3>
              <ul className="list-disc list-inside text-gray-700">
                {currentPlan.medication.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Exercises */}
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2">🏃 Exercises</h3>
              <ul className="list-disc list-inside text-gray-700">
                {currentPlan.exercises.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Wearables */}
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2">⌚ Wearables</h3>
              <ul className="list-disc list-inside text-gray-700">
                {currentPlan.wearables.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Diet Plan */}
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2">🥗 Diet Plan</h3>
              <ul className="list-disc list-inside text-gray-700">
                {currentPlan.diet.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Custom scrollbar CSS */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e0; /* gray-300 */
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a0aec0; /* gray-400 */
          }
        `}
      </style>
    </div>
  );
}
