const mongoose = require("mongoose");
const { Schema } = mongoose;
const SupportAgentSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Support Agent",
    },
  },
  { timestamps: true },
);

const SupportAgent = mongoose.model("SupportAgent", SupportAgentSchema);
module.exports = { SupportAgent };
