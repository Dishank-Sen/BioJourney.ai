import getConversation from "../pinecone/getConversation.js";
import retrieveData from "../pinecone/retrieveData.js";

export default async function getSimilarResult(userMsg) {
  try {
    let tier_1_result = await retrieveData(userMsg, "tier1", 5);
    let tier_2_result = await retrieveData(userMsg, "tier2", 5);
    let tier_3_result = await retrieveData(userMsg, "tier3", 5);
    let tier_4_result = await retrieveData(userMsg, "tier4", 5);
    console.log("tier 2 results:",tier_2_result);

    tier_1_result = (await Promise.all(
      tier_1_result.map((result) => getConversation(result, "tier1"))
    )).filter(Boolean);
    tier_2_result = (await Promise.all(
      tier_2_result.map((result) => getConversation(result, "tier2"))
    )).filter(Boolean);
    tier_3_result = (await Promise.all(
      tier_3_result.map((result) => getConversation(result, "tier3"))
    )).filter(Boolean);
    tier_4_result = (await Promise.all(
      tier_4_result.map((result) => getConversation(result, "tier4"))
    )).filter(Boolean);

    const combinedResult = [
      ...tier_4_result,
      ...tier_3_result,
      ...tier_2_result,
      ...tier_1_result,
    ];
    return combinedResult;
  } catch (error) {
    console.log("get similar result error:", error);
  }
}