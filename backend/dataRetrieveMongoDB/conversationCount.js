import CarlaNutrition from "../models/carla.js";
import DrWarren from "../models/dr_warren.js";
import RachelPhysio from "../models/rachel.js";
import AdvikPerformance from "../models/advik.js";
import NeelConcierge from "../models/neel.js";
import RubyConcierge from "../models/ruby.js";

export default async function getConversationCount(userId){
    try {
        const carlaUser = await CarlaNutrition.findOne({userId: userId});
        const DrWarrenUser = await DrWarren.findOne({userId: userId});
        const rachelUser = await RachelPhysio.findOne({userId: userId});
        const advikUser = await AdvikPerformance.findOne({userId: userId});
        const neelUser = await NeelConcierge.findOne({userId: userId});
        const rubyUser = await RubyConcierge.findOne({userId: userId});

        const count = [{name: "Carla", value: carlaUser.count },
            {name: "Dr Warren", value: DrWarrenUser.count},
            {name: "Rachel", value: rachelUser.count},
            {name: "Advik", value: advikUser.count},
            {name: "Neel", value: neelUser.count},
            {name: "Ruby", value: rubyUser.count}
        ]
        let totalCount = 0;
        for(let i = 0; i < count.length; i++){
            totalCount = totalCount + count[i].value;
        }
        return {count: count, totalCount: totalCount}
    } catch (error) {
        console.log("count error:",error)
        return {count: [],totalCount: 0}
    }
}