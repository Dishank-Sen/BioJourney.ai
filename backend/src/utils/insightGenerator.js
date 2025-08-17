export function generateInsights({ type, data, fileName }) {
  const insights = [];

  if (type === "csv") {
    // Example wearable analysis
    const avgSleep = data.reduce((sum, row) => sum + Number(row.sleep || 0), 0) / data.length;
    if (avgSleep < 6) {
      insights.push({
        type: "wearable",
        metric: "sleep",
        value: avgSleep,
        unit: "hours",
        summary: `Low average sleep (${avgSleep.toFixed(1)}h this week)`,
        source: fileName,
      });
    }
  }

  if (type === "pdf" || type === "image") {
    const text = data.toLowerCase();

    // LDL check
    const ldlMatch = text.match(/ldl[^0-9]*(\d{2,3})/);
    if (ldlMatch && Number(ldlMatch[1]) > 130) {
      insights.push({
        type: "lab",
        metric: "LDL",
        value: Number(ldlMatch[1]),
        unit: "mg/dL",
        summary: `High LDL detected (${ldlMatch[1]} mg/dL)`,
        source: fileName,
      });
    }

    // CRP check
    const crpMatch = text.match(/crp[^0-9]*(\d+(\.\d+)?)/);
    if (crpMatch && Number(crpMatch[1]) > 3) {
      insights.push({
        type: "lab",
        metric: "CRP",
        value: Number(crpMatch[1]),
        unit: "mg/L",
        summary: `Inflammation marker CRP elevated (${crpMatch[1]} mg/L)`,
        source: fileName,
      });
    }
  }

  return insights;
}
