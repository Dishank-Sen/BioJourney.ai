export function generateInsights({ type, data, fileName }) {
  const insights = [];

  if (type === "csv") {
    // ✅ Normalize keys to lowercase for flexibility
    const normalize = (str) => str.toLowerCase().replace(/\s+/g, "");

    // Helper: average column
    const avg = (key) => {
      const values = data
        .map((row) => Number(row[key] || row[normalize(key)] || 0))
        .filter((v) => !isNaN(v));
      return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    };

    // ---- Wearable Metrics ----
    const avgSleep = avg("sleep");
    if (avgSleep && avgSleep < 6) {
      insights.push({
        type: "wearable",
        metric: "Sleep",
        value: avgSleep,
        unit: "hours",
        summary: `Low average sleep (${avgSleep.toFixed(1)}h)`,
        source: fileName,
      });
    }

    const avgHRV = avg("hrv");
    if (avgHRV && avgHRV < 50) {
      insights.push({
        type: "wearable",
        metric: "HRV",
        value: avgHRV,
        unit: "ms",
        summary: `Low HRV detected (${avgHRV.toFixed(0)} ms) – possible stress or fatigue`,
        source: fileName,
      });
    }

    const avgRecovery = avg("recovery");
    if (avgRecovery && avgRecovery < 70) {
      insights.push({
        type: "wearable",
        metric: "Recovery",
        value: avgRecovery,
        unit: "%",
        summary: `Low recovery score (${avgRecovery.toFixed(0)}%)`,
        source: fileName,
      });
    }

    // ---- Lab Values ----
    const avgLDL = avg("ldl");
    if (avgLDL && avgLDL > 130) {
      insights.push({
        type: "lab",
        metric: "LDL",
        value: avgLDL,
        unit: "mg/dL",
        summary: `High LDL detected (${avgLDL.toFixed(0)} mg/dL)`,
        source: fileName,
      });
    }

    const avgCRP = avg("crp");
    if (avgCRP && avgCRP > 3) {
      insights.push({
        type: "lab",
        metric: "CRP",
        value: avgCRP,
        unit: "mg/L",
        summary: `CRP elevated (${avgCRP.toFixed(1)} mg/L) – inflammation marker`,
        source: fileName,
      });
    }

    const avgVitaminD = avg("vitamind");
    if (avgVitaminD && avgVitaminD < 30) {
      insights.push({
        type: "lab",
        metric: "Vitamin D",
        value: avgVitaminD,
        unit: "ng/mL",
        summary: `Low Vitamin D (${avgVitaminD.toFixed(0)} ng/mL) – deficiency risk`,
        source: fileName,
      });
    }

    const avgHemoglobin = avg("hemoglobin");
    if (avgHemoglobin && avgHemoglobin < 12) {
      insights.push({
        type: "lab",
        metric: "Hemoglobin",
        value: avgHemoglobin,
        unit: "g/dL",
        summary: `Low Hemoglobin (${avgHemoglobin.toFixed(1)} g/dL) – possible anemia`,
        source: fileName,
      });
    }

    const avgGlucose = avg("glucose");
    if (avgGlucose && avgGlucose > 110) {
      insights.push({
        type: "lab",
        metric: "Glucose",
        value: avgGlucose,
        unit: "mg/dL",
        summary: `High glucose detected (${avgGlucose.toFixed(0)} mg/dL)`,
        source: fileName,
      });
    }

    // ---- Lifestyle / Diet ----
    const avgHydration = avg("hydration");
    if (avgHydration && avgHydration < 2.5) {
      insights.push({
        type: "lifestyle",
        metric: "Hydration",
        value: avgHydration,
        unit: "L/day",
        summary: `Low hydration (${avgHydration.toFixed(1)} L/day)`,
        source: fileName,
      });
    }

    const avgFiber = avg("fiber");
    if (avgFiber && avgFiber < 25) {
      insights.push({
        type: "lifestyle",
        metric: "Fiber",
        value: avgFiber,
        unit: "g/day",
        summary: `Low fiber intake (${avgFiber.toFixed(0)} g/day)`,
        source: fileName,
      });
    }

    const avgExercise = avg("exercise_minutes");
    if (avgExercise && avgExercise < 150) {
      insights.push({
        type: "lifestyle",
        metric: "Exercise",
        value: avgExercise,
        unit: "minutes/week",
        summary: `Low physical activity (${avgExercise.toFixed(0)} min/week)`,
        source: fileName,
      });
    }
  }

  return insights;
}