import { saveAdvikData } from "./advikDB.js";
import { saveCarlaData } from "./carlaDB.js";
import { saveConversation } from "./conversationDB.js";
import { saveDrWarrenData } from "./dr_warrenDB.js";
import { saveNeelData } from "./neelDB.js";
import { saveRachelData } from "./rachelDB.js";
import { saveRubyData } from "./rubyDB.js";

export async function seedDatabase() {
  try {
    // Fake userId for testing
    const userId = "68a1ca9892c8c177a63ee0d0";

    const advikInfo = {
      userId,
      extracted: {
        sleep: [{ metric: "Deep Sleep", value: "6", unit: "hours", reason: "Normal cycle" }],
        recovery: [{ metric: "Muscle Recovery", value: "80", unit: "%", reason: "Post workout recovery" }],
        hrv: [{ metric: "HRV", value: "65", unit: "ms", reason: "Healthy HRV" }],
        stress: [{ metric: "Cortisol", value: "12", unit: "µg/dL", reason: "Slight stress detected" }],
      },
      changes_detected: {
        new: { sleep: [{ metric: "REM", value: "2", unit: "hours", reason: "New record" }] },
        updated: { stress: [{ metric: "Cortisol", value: "14", unit: "µg/dL", reason: "Increased stress" }] },
      },
    };

    const carlaInfo = {
      userId,
      extracted: {
        dietary_preference: [
          { type: "Vegetarian", reason: "Initial preference stated by user.", importance: "high" }
        ],
        allergies: [
          { allergy_name: "Sensitization", caused_by: "water", reason: "User has a known history of severe reactions to peanut consumption.", importance: "high" }
        ],
        breakfast: [
          { item_suggested: "Oats", reason: "High in soluble fiber, which is beneficial for heart health and digestion."}
        ],
        lunch: [
          { item_suggested: "Grilled Paneer", reason: "Excellent source of protein and calcium for a vegetarian diet." }
        ],
        dinner: [
          { item_suggested: "Lentil Soup", reason: "A light, nutrient-dense meal that is easy to digest in the evening." }
        ],
      },
      changes_detected: {
        new: {
          allergies: [{
            allergy_name: "Lactose",
            caused_by: "Milk",
            reason: "Patient reported significant bloating and abdominal discomfort after consuming dairy. These symptoms are consistent with lactose intolerance, requiring dietary adjustment.",
            importance: "medium",
          },
          { allergy_name: "Allergens",
            caused_by: "peanut",
            reason: "These are substances that trigger allergic reactions. Common examples include pollen, dust mites, pet dander, certain foods (like peanuts or milk), insect stings, medications, and latex",
            importance: "high" 
          }],
        },
        updated: {
          dietary_preference: [{
            type: "Vegan",
            reason: "Patient has decided to transition from vegetarian to a fully vegan diet for ethical and health reasons. This necessitates careful planning to ensure all nutritional needs are met.",
            importance: "high"
          }],
          lunch: [{
            item_suggested: "Quinoa bowl with chickpeas and roasted vegetables",
            reason: "This replaces Grilled Paneer to align with the new vegan preference. The quinoa and chickpea combination provides a complete protein, and the vegetables add essential vitamins."
          }],
        },
      },
    };

    const conversationInfo = {
      userId,
      conversation: [
        { userReply: "Hello Carla", assistantReply: "Hi! How can I help?", persona: "Carla", createdAt: new Date() },
        { userReply: "Suggest a meal", assistantReply: "Try oats for breakfast.", persona: "Carla", createdAt: new Date() },
      ]
    };

    const DrWarrenInfo = {
      userId,
      extracted: {
        medication: [{ medication_name: "Paracetamol", dosage: "500mg", frequency: "2/day", reason: "Fever", importance: "medium" }],
        test_results: [{ test_name: "Blood Sugar", value: "110", unit: "mg/dL", reference_range: "70-120", importance: "high" }],
        diseases: [{ condition_name: "Hypertension", classification: "chronic", reason: "High BP", importance: "high" }],
        health_change: [{ metric: "Weight", direction: "down", value: "2kg", duration: "1 month", importance: "medium" }],
      },
      changes_detected: {
        new:{ medication: [{ medication_name: "Ibuprofen", dosage: "400mg", frequency: "1/day", reason: "Inflammation", importance: "high" }],
              test_results: [{ test_name: "Blood Sugar", value: "110", unit: "mg/dL", reference_range: "70-120", importance: "high" }]
       },
        updated: { diseases: [{ condition_name: "Hypertension", classification: "chronic", reason: "BP stabilized with medication", importance: "high" }] },
      },
    };

    const neelInfo = {
      userId,
      extracted: {
        strategic_goals: [{ goal: "Increase revenue", reason: "Target for Q1", importance: "high" }],
        risks: [{ risk: "Delayed delivery", reason: "Some other reason",importance: "high" }],
        client_feedback: [{ feedback: "Great service", sentiment: "positive", reason: "Some other reason", importance: "low" }],
        program_alignment: [{ area: "Operations", status: "on_track", reason: "Some other reason", importance: "low" }],
      },
      changes_detected: {
        new: { strategic_goals: [{ goal: "Expand to APAC market", reason: "Growth potential", importance: "medium" }] },
        updated: { risks: [{ risk: "Delayed delivery", reason: "Some other reason",importance: "medium" }] },
      },
    };

    const rachelInfo = {
      userId,
      extracted: {
        exercise: [{ exercise_name: "Running", duration: "30 min", frequency: "5 days/week", intensity: "moderate", reason: "To enhance stamina", importance: "medium" }],
        mobility_rehab: [{ movement: "Knee Flexion", limitation: "Stiffness", pain_level: "moderate", reason: "To increase Strength", importance: "medium" }],
        injury: [{ injury_name: "ACL Tear", severity: "moderate", location: "Knee", reason: "To participate in marathon.", importance: "high" }],
        progress: [{ metric: "Flexibility", direction: "up", value: "15%", reason:"To be health and flexible.", importance: "medium" }],
      },
      changes_detected: {
        new: { exercise: [{ exercise_name: "Cycling", duration: "20 min", frequency: "3 days/week", intensity: "low", reason: "Participating the competition.", importance: "high" }] },
        updated: { progress: [{ metric: "Flexibility", direction: "up", value: "20%", reason:"To participate in olympics.", importance: "high" }] },
      },
    };

    const rubyInfo = {
      userId,
      extracted: {
        appointments: [{ appointment_type: "Dentist", date: "2025-08-20", time: "10:00 AM", location: "City Clinic", reason: "some reason.", importance: "low" }],
        reminders: [{ reminder_type: "Drink Water", due_date: "Every 2 hrs", frequency: "Daily", reason: "some reason.", importance: "medium" }],
        follow_ups: [{ follow_up_type: "Physio Session", due_date: "2025-08-25", notes: "Check mobility", reason: "some reason.", importance: "high" }],
        tasks: [{ task: "Buy Groceries", deadline: "2025-08-18", reason: "some reason.", importance: "medium", }],
      },
      changes_detected: {
        new: { tasks: [{ task: "Pay Bills", deadline: "2025-08-19", reason: "some reason.", importance: "high" }] },
        updated: { reminders: [{ reminder_type: "Drink Water", due_date: "Every 1 hr", frequency: "Daily", reason: "some reason.", importance: "low" }] },
      },
    };

    /** ----------------- AdvikPerformance ----------------- */
    console.log("inserting advik data..")
    await saveAdvikData(userId, advikInfo);

    /** ----------------- CarlaNutrition ----------------- */
    console.log("inserting carla data..")
    await saveCarlaData(userId, carlaInfo);

    /** ----------------- Conversation ----------------- */
    console.log("saving conversation")
    await saveConversation(userId, conversationInfo,"ruby");

    /** ----------------- DrWarren ----------------- */
    console.log("saving dr warren data..")
    await saveDrWarrenData(userId, DrWarrenInfo);

    /** ----------------- NeelConcierge ----------------- */
    console.log("saving neel data..")
    await saveNeelData(userId, neelInfo);

    /** ----------------- RachelPhysio ----------------- */
    console.log("save rachel data..")
    await saveRachelData(userId, rachelInfo);

    /** ----------------- RubyConcierge ----------------- */
    console.log("saving rauby data..")
    await saveRubyData(userId, rubyInfo);

    console.log("✅ Dummy data inserted successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error inserting dummy data:", err.message);
    process.exit(1);
  }
}

