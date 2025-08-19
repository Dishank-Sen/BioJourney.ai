import React, { useEffect, useState } from "react";

export default function ReportCards() {
  // State for storing the array of reports
  const [reports, setReports] = useState([]);
  
  // State to manage loading status
  const [loading, setLoading] = useState(true);

  // State to handle any errors during the API call
  const [error, setError] = useState(null);

  // Hardcoded userId for demonstration purposes. In a real app,
  // this would likely come from an authentication context or props.
  const [userId, setUserId] = useState("68a1ca9892c8c177a63ee0d0");

  useEffect(() => {
    // Define the async function to fetch data
    async function fetchReports() {
      // Reset states before fetching
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://${import.meta.env.VITE_EC2_ENDPOINT}/api/reports`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId })
          }
        );
        console.log(res)
        // Check if the response was successful
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Error: ${res.status}`);
        }

        const data = await res.json();
        setReports(data);

      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setError(err.message); // Set the error message to display in the UI
      } finally {
        setLoading(false); // Ensure loading is set to false in all cases
      }
    }

    // Call the fetch function
    fetchReports();
  }, [userId]); // The effect will re-run if the userId changes

  // --- Render Logic ---

  // 1. Show a loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        <span className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent mr-3"></span>
        Loading reports...
      </div>
    );
  }

  // 2. Show an error message if the fetch failed
  if (error) {
    return (
      <div className="flex justify-center items-center p-8 text-red-500 bg-red-50 rounded-lg">
        <p><strong>Error:</strong> {error}</p>
      </div>
    );
  }

  // 3. Show a message if there are no reports for the user
  if (!reports.length) {
    return <p className="text-center text-gray-500 p-8">No reports available yet.</p>;
  }

  // 4. Render the report cards if data is successfully fetched
  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Your Medical Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {reports.map((report) => (
          <div
            // Use report._id for a stable and unique key
            key={report._id || report.timestamp} 
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Report from {new Date(report.timestamp).toLocaleDateString()}
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              {new Date(report.timestamp).toLocaleTimeString()}
            </p>

            {/* Patient Info */}
            {report.patient && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                <p><span className="font-medium text-gray-700">Name:</span> {report.patient.name || "N/A"}</p>
                <p><span className="font-medium text-gray-700">Age:</span> {report.patient.age || "N/A"}</p>
                <p><span className="font-medium text-gray-700">Sex:</span> {report.patient.sex || "N/A"}</p>
              </div>
            )}

            {/* Sections */}
            {report.sections?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-indigo-600 mb-2">Details</h3>
                <div className="space-y-2">
                  {report.sections.map((sec, i) => (
                    <div key={i} className="border rounded-lg p-3 bg-white">
                      <p className="text-sm font-semibold text-gray-700">
                        {sec.section_name}
                      </p>
                      {Array.isArray(sec.observations) ? (
                        <ul className="list-disc pl-5 mt-1 text-gray-600 text-sm">
                          {sec.observations.map((obs, j) => (
                            <li key={j}>
                              {typeof obs === "string"
                                ? obs
                                : Object.entries(obs)
                                    .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
                                    .join(", ")}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600 mt-1">{sec.observations}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Findings */}
            {report.findings?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-blue-600">Findings</h3>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1 mt-2">
                  {report.findings.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {report.recommendations?.length > 0 && (
              <div>
                <h3 className="font-semibold text-green-600">Recommendations</h3>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1 mt-2">
                  {report.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
