import React, { useState, useEffect } from "react";
import Timeline from "./Timeline.jsx";
import { ExerciseIcon, AllergyIcon, DietIcon, DiseaseIcon, HealthIcon, InjuryIcon, MedicationIcon, MobilityIcon, ProgressIcon, TestIcon,DefaultIcon } from "./EventIcons.jsx";

// Helper functions (no changes)
const generateTitle = (item) => {
    if (!item) return "Invalid Event";
    return `${(item.parent || 'Event').charAt(0).toUpperCase() + (item.parent || 'Event').slice(1)} ${item.tag || ''}`;
};
const getIconForEvent = (parent) => {
    const iconMap = { dietary_preference: DietIcon, medication: MedicationIcon, exercise: ExerciseIcon, allergies: AllergyIcon, progress: ProgressIcon, diseases: DiseaseIcon, health_change: HealthIcon, injury: InjuryIcon, mobility_rehab: MobilityIcon, test_results: TestIcon};
    return iconMap[parent] || DefaultIcon;
};
const PlaceholderGraph = () => ( <svg className="w-full h-24 text-gray-300" fill="none" viewBox="0 0 300 100" preserveAspectRatio="none"><path d="M0 80 C 50 80, 70 40, 100 50 S 150 80, 200 70 S 250 50, 300 60" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M0 80 C 50 80, 70 40, 100 50 S 150 80, 200 70 S 250 50, 300 60" stroke="url(#line-gradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="line-gradient" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#3b82f6" offset="0.3"/><stop stopColor="#3b82f6" stopOpacity="0" offset="1"/></linearGradient></defs></svg> );


export default function C2() {
  const [userId, setUserId] = useState("");
  const [events, setEvents] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeTab, setActiveTab] = useState("Timeline");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUserId("68a1ca9892c8c177a63ee0d0");
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchTimelineData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3000/api/timeline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) {
          throw new Error(`API request failed with status: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        
        // --- THIS IS THE FIXED LINE ---
        // It now correctly checks for a 'message' property in your API response.
        const raw = Array.isArray(data) ? data : Array.isArray(data.message) ? data.message : Array.isArray(data.timeline) ? data.timeline : [];

        if (raw.length === 0) {
            setEvents([]);
            setLoading(false);
            return;
        }
      
        const mapped = raw
          .map((item) => {
            if (!item || !item._id || !item.parent) {
              return null;
            }
            return {
              id: item._id,
              title: generateTitle(item),
              icon: getIconForEvent(item.parent),
              suggestedBy: item.persona ? item.persona.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Unknown',
              reason: item.reason || "No reason provided.",
              raw: item,
              time: new Date(item.timestamp).toLocaleString(),
              date: new Date(item.timestamp).toLocaleDateString()
            };
          })
          .filter(Boolean);
      
        const sorted = mapped.sort((a, b) => new Date(a.raw.timestamp).getTime() - new Date(b.raw.timestamp).getTime());
        setEvents(sorted);
        const defaultActiveEvent = sorted[sorted.length - 1];
        setActiveId(defaultActiveEvent.id);

      } catch (err) {
        setError(err.message || "An unknown error occurred.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, [userId]);

  const activeEvent = events.find((e) => e.id === activeId);

  // --- UI Code (No Changes) ---
  return (
    <div className="p-4 md:p-8 bg-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold text-gray-800">Member Journey</h1><div className="flex items-center gap-3 bg-gray-100 rounded-full py-2 px-4"><div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-semibold">RP</div><span className="font-semibold text-gray-700">Rohan Patel</span></div></header>
        <div className="flex border-b mb-8"><button onClick={() => setActiveTab("Timeline")} className={`px-4 py-2 font-semibold transition-colors duration-200 ${ activeTab === "Timeline" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"}`}>Timeline</button><button onClick={() => setActiveTab("Metrics")} className={`px-4 py-2 font-semibold transition-colors duration-200 ${ activeTab === "Metrics" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"}`}>Metrics</button></div>
        {activeTab === "Timeline" && (
          <div className="space-y-12">
            {loading && <p className="text-center text-gray-500">Loading Journey...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}
            {!loading && !error && events.length === 0 && ( <p className="text-center text-gray-500">No timeline events found for this user.</p> )}
            {!loading && !error && events.length > 0 && (
              <>
                <Timeline events={events} activeId={activeId} onSelect={setActiveId} />
                <div>
                  {activeEvent ? (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{activeEvent.title}</h2>
                    <div className="mb-6"><p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Suggested By</p>
                    <p className="text-lg text-gray-800">{activeEvent.suggestedBy}</p>
                    </div>
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Reason</p>
                      <p className="text-md text-gray-600 leading-relaxed">{activeEvent.reason}</p>
                    </div>
                    <div className="mt-8">
                      <PlaceholderGraph />
                    </div>
                  </div>
                  ) : ( <p className="text-center text-gray-500">Please select an event from the timeline.</p> )}
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === "Metrics" && <div className="p-8 text-center text-gray-500">Metrics data and visualizations would be displayed here.</div>}
      </div>
    </div>
  );
}