const mongoose = require("mongoose");
const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
  },
  { timestamps: true },
);

const LeadsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    source: {
      type: String,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Lost", "Won"],
      default: "New",
    },
    tags: [
      {
        type: String,
      },
    ],
    assigned: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "assignedModel",
    },
    assignedModel: {
      type: String,
      enum: ["SupportAgent", "SubAdmin"],
    },
    notes: [noteSchema],
  },
  { timestamps: true },
);

const Leads = mongoose.model("Leads", LeadsSchema);
module.exports = { Leads };
