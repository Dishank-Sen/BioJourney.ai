import mongoose from "mongoose";
import CarlaNutrition from "../models/carla.js";
import DrWarren from "../models/dr_warren.js";
import RachelPhysio from "../models/rachel.js";

export default async function getTimelineData(userId) {
  try {

    let timeline = [];

    const normalize = (entry, tag, parent, persona) => ({
      tag,
      parent,
      ...entry.toObject(),
      persona
    });

    // ---------- Carla ----------
    const carlaUser = await CarlaNutrition.findOne({ userId });
    // console.log("Carla User:",carlaUser)
    if (carlaUser) {
      ["new", "updated"].forEach(tag => {
        Object.keys(carlaUser.changes_detected[tag]).forEach(parent => {
          carlaUser.changes_detected[tag][parent].forEach(entry => {
            timeline.push(normalize(entry, tag, parent, "carla"));
          });
        });
      });
    }

    // ---------- Dr Warren ----------
    const drWarrenUser = await DrWarren.findOne({ userId });
    // console.log("dr warren:", drWarrenUser)
    if (drWarrenUser) {
      ["new", "updated"].forEach(tag => {
        Object.keys(drWarrenUser.changes_detected[tag]).forEach(parent => {
          drWarrenUser.changes_detected[tag][parent].forEach(entry => {
            timeline.push(normalize(entry, tag, parent, "dr_warren"));
          });
        });
      });
    }

    // ---------- Rachel ----------
    const rachelUser = await RachelPhysio.findOne({ userId });
    // console.log("rachel user:",rachelUser)
    if (rachelUser) {
      ["new", "updated"].forEach(tag => {
        Object.keys(rachelUser.changes_detected[tag]).forEach(parent => {
          rachelUser.changes_detected[tag][parent].forEach(entry => {
            timeline.push(normalize(entry, tag, parent, "rachel"));
          });
        });
      });
    }

    // ---------- Sort by timestamp ----------
    timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    console.log("timeline",timeline);
    return timeline;
  } catch (error) {
    console.error("timeline data fetch error:", error);
    return [];
  }
}
