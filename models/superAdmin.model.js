const mongoose = require("mongoose");
const { Schema } = mongoose;
const SuperAdminSchema = new Schema(
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
      default: "Super Admin",
    },
  },
  { timestamps: true },
);

const SuperAdmin = mongoose.model("SuperAdmin", SuperAdminSchema);
module.exports = { SuperAdmin };
