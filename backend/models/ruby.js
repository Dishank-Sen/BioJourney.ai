import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  appointment_type: String,
  date: String,
  time: String,
  location: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const ReminderSchema = new mongoose.Schema({
  reminder_type: String,
  due_date: String,
  frequency: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const FollowUpSchema = new mongoose.Schema({
  follow_up_type: String,
  due_date: String,
  notes: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" }
});

const TaskSchema = new mongoose.Schema({
  task: String,
  deadline: String,
  importance: { type: String, enum: ["high", "medium", "low"], default: "medium" },
  reason: String,
  timestamp: { type: Date, default: Date.now }
});

const RubySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  extracted: {
    appointments: [AppointmentSchema],
    reminders: [ReminderSchema],
    follow_ups: [FollowUpSchema],
    tasks: [TaskSchema]
  },
  changes_detected: {
    new: {
      appointments: [AppointmentSchema],
      reminders: [ReminderSchema],
      follow_ups: [FollowUpSchema],
      tasks: [TaskSchema]
    },
    updated: {
      appointments: [AppointmentSchema],
      reminders: [ReminderSchema],
      follow_ups: [FollowUpSchema],
      tasks: [TaskSchema]
    }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("RubyConcierge", RubySchema);
