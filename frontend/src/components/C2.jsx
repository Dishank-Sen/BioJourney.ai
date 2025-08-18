import React, { useState, useEffect } from "react";
import Timeline from "./Timeline.jsx";
import { ExerciseIcon, AllergyIcon, DietIcon, DiseaseIcon, HealthIcon, InjuryIcon, MedicationIcon, MobilityIcon, ProgressIcon, TestIcon,DefaultIcon } from "./EventIcons.jsx";
import MetricData from "./Metric.jsx";

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



// Helper functions (no changes)
const generateTitle = (item) => {
    if (!item) return "Invalid Event";
    return `${(item.parent || 'Event').charAt(0).toUpperCase() + (item.parent || 'Event').slice(1)} ${item.tag || ''}`;
};
const generateSubtitle = (item) => {
  if(item.persona === 'carla'){
    if(item.parent === 'allergies') return item.allergy_name
    if(item.parent === 'dietary_preference') return item.type
  }else if(item.persona === 'dr_warren'){
    if(item.parent === 'medication') return item.medication_name
    if(item.parent === 'test_results') return item.test_name
    if(item.parent === 'disease') return item.condition_name
    if(item.parent === 'health_change') return item.metric
  }else if(item.persona === 'rachel'){
    if(item.parent === 'exercise') return item.exercise_name
    if(item.parent === 'mobility_rehab') return item.movement
    if(item.parent === 'injury') return item.injury_name
    if(item.parent === 'progress') return item.metric
  }
}
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
        const res = await fetch(`https://${import.meta.env.VITE_EC2_ENDPOINT}/api/timeline`, {
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
        console.log("raw:",raw)
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
              parent: item.parent,
              subTitle: generateSubtitle(item),
              icon: getIconForEvent(item.parent),
              suggestedBy: item.persona ? item.persona.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Unknown',
              reason: item.reason || "No reason provided.",
              raw: item,
              time: new Date(item.timestamp).toLocaleString(),
              date: new Date(item.timestamp).toLocaleDateString(),
              medication_name: item.medication_name || null,
              dosage: item.dosage || null,
              frequency: item.frequency || null,
              test_name: item.test_name || null,
              value: item.value || null,
              unit: item.unit || null,
              reference_range: item.reference_range || null,
              condition_name: item.condition_name || null,
              classification: item.classification || null,
              metric: item.metric || null,
              direction: item.direction || null,
              duration: item.duration || null,
              allergy_name: item.allergy_name || null,
              caused_by: item.caused_by || null,
              type: item.type || null,
              exercise_name: item.exercise_name || null,
              intensity: item.intensity || null,
              movement: item.movement || null,
              limitation: item.limitation || null,
              pain_level: item.pain_level || null,
              injury_name: item.injury_name || null,
              severity: item.severity || null,
              location: item.location || null
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
    fetchTimelineData();
  }, [userId]);
  
  const activeEvent = events.find((e) => e.id === activeId);
  // console.log("active event:", activeEvent)

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
                      {/* Subtitle or main title */}
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{activeEvent.subTitle}</h2>

                      {/* Suggested By */}
                      <div className="mb-6">
                        <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Suggested By</p>
                        <p className="text-lg text-gray-800">{activeEvent.suggestedBy || activeEvent.persona}</p>
                      </div>

                      {/* Conditionally render sections based on parent */}
                      {/* Medication */}
                      {activeEvent.parent === "medication" && (
                        <div className="mb-6">
                          {/* <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Medication</p> */}
                          <p className="text-md text-gray-600 leading-relaxed">
                            {activeEvent.medication_name} – {activeEvent.dosage} ({activeEvent.frequency})
                          </p>
                          <p className="text-lg text-gray-800">Reason</p>
                          <p className="text-sm text-gray-500">{activeEvent.reason}</p>
                          {/* <p className="text-sm text-gray-500">Importance: {activeEvent.importance}</p> */}
                        </div>
                      )}

                      {/* Test Results */}
                      {activeEvent.parent === "test_results" && (
                        <div className="mb-6">
                          {/* <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Test Result</p> */}
                          <p className="text-md text-gray-600 leading-relaxed">
                            {activeEvent.test_name}: {activeEvent.value} {activeEvent.unit} (Range: {activeEvent.reference_range})
                          </p>
                          <p className="text-lg text-gray-800">Reason</p>
                          <p className="text-sm text-gray-500">{activeEvent.reason}</p>
                          {/* <p className="text-sm text-gray-500">Importance: {activeEvent.importance}</p> */}
                        </div>
                      )}

                      {/* Diseases */}
                      {activeEvent.parent === "diseases" && (
                        <div className="mb-6">
                          {/* <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Condition</p> */}
                          <p className="text-md text-gray-600 leading-relaxed">
                            {activeEvent.condition_name} ({activeEvent.classification})
                          </p>
                          <p className="text-lg text-gray-800">Reason</p>
                          <p className="text-sm text-gray-500">{activeEvent.reason}</p>
                          {/* <p className="text-sm text-gray-500">Importance: {activeEvent.importance}</p> */}
                        </div>
                      )}

                      {/* Allergies */}
                      {activeEvent.parent === "allergies" && (
                        <div className="mb-6">
                          {/* <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Allergy</p> */}
                          <p className="text-md text-gray-600 leading-relaxed">
                            {activeEvent.allergy_name} (Caused by: {activeEvent.caused_by})
                          </p>
                          <p className="text-lg text-gray-800">Reason</p>
                          <p className="text-lg text-gray-800">{activeEvent.reason}</p>
                          {/* <p className="text-sm text-gray-500">Importance: {activeEvent.importance}</p> */}
                        </div>
                      )}

                      {/* Dietary Preferences */}
                      {activeEvent.parent === "dietary_preference" && (
                        <div className="mb-6">
                          {/* <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Dietary Preference</p> */}
                          <p className="text-md text-gray-600 leading-relaxed">{activeEvent.type}</p>
                          <p className="text-lg text-gray-800">Reason</p>
                          <p className="text-sm text-gray-500">{activeEvent.reason}</p>
                          {/* <p className="text-sm text-gray-500">Importance: {activeEvent.importance}</p> */}
                        </div>
                      )}

                      {/* Exercise */}
                      {activeEvent.parent === "exercise" && (
                        <div className="mb-6">
                          {/* <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Exercise</p> */}
                          <p className="text-md text-gray-600 leading-relaxed">
                            {activeEvent.exercise_name} – {activeEvent.duration}, {activeEvent.frequency} ({activeEvent.intensity})
                          </p>
                          <p className="text-lg text-gray-800">Reason</p>
                          <p className="text-sm text-gray-500">{activeEvent.reason}</p>
                          {/* <p className="text-sm text-gray-500">Importance: {activeEvent.importance}</p> */}
                        </div>
                      )}

                      {/* Mobility / Rehab */}
                      {activeEvent.parent === "mobility_rehab" && (
                        <div className="mb-6">
                          {/* <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Mobility / Rehab</p> */}
                          <p className="text-md text-gray-600 leading-relaxed">
                            Movement: {activeEvent.movement}, Limitation: {activeEvent.limitation}, Pain: {activeEvent.pain_level}, Duration: {activeEvent.duration}
                          </p>
                          <p className="text-lg text-gray-800">Reason</p>
                          <p className="text-sm text-gray-500">{activeEvent.reason}</p>
                          {/* <p className="text-sm text-gray-500">Importance: {activeEvent.importance}</p> */}
                        </div>
                      )}

                      {/* Injury */}
                      {activeEvent.parent === "injury" && (
                        <div className="mb-6">
                          {/* <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Injury</p> */}
                          <p className="text-md text-gray-600 leading-relaxed">
                            {activeEvent.injury_name} ({activeEvent.severity}) – Location: {activeEvent.location}
                          </p>
                          <p className="text-lg text-gray-800">Reason</p>
                          <p className="text-sm text-gray-500">{activeEvent.reason}</p>
                          {/* <p className="text-sm text-gray-500">Importance: {activeEvent.importance}</p> */}
                        </div>
                      )}

                      {/* Progress */}
                      {activeEvent.parent === "progress" && (
                        <div className="mb-6">
                          {/* <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Progress</p> */}
                          <p className="text-md text-gray-600 leading-relaxed">
                            {activeEvent.metric}: {activeEvent.value} ({activeEvent.direction})
                          </p>
                          <p className="text-lg text-gray-800">Reason</p>
                          <p className="text-sm text-gray-500">{activeEvent.reason}</p>
                          {/* <p className="text-sm text-gray-500">Importance: {activeEvent.importance}</p> */}
                        </div>
                      )}


                      {/* Graph Section */}
                      <div className="mt-8">
                        <PlaceholderGraph />
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">Please select an event from the timeline.</p>
                  )}
                </div>

              </>
            )}
          </div>
        )}
        {activeTab === "Metrics" && <MetricData data={metricData}/>}
      </div>
    </div>
  );
}