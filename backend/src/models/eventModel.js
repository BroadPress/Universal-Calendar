const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    organisation: { type: String, default: "" },
    industry: { type: String, default: "" },
    eventType: {
      type: String,
      enum: [
        "National Days",
        "International Days",
        "Nepali Festivals",
        "Anniversaries",
        "Birthday",
        "Holiday"
      ],
      required: true,
    },
    repeatsYearly: { type: Boolean, default: false },
    date: {
      day: { type: Number, required: true },
      month: { type: String, required: true },
      year: { type: Number, required: true },
    },
    description: { type: String, default: "" } // <-- new field
  },
  { timestamps: true }
);

const Event = model("Event", eventSchema);
module.exports = Event;
