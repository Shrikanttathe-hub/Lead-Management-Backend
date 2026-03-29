const mongoose = require("mongoose");
const { Schema } = mongoose;
const SubAdminSchema = new Schema(
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
      default: "Sub Admin",
    },
  },
  { timestamps: true },
);

const SubAdmin = mongoose.model("SubAdmin", SubAdminSchema);
module.exports = { SubAdmin };
