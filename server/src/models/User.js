const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      default: "student",
    },
    staffType: {
      type: String,
      enum: ["canteen", "sports", "lostfound", "clubs", null],
      default: null,
    },
    studentId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
      match: [/^IT\d{7}$/, "Invalid Student ID format"],
    },
    preferences: {
      skills: {
        type: [String],
        default: [],
      },
      activities: {
        type: [String],
        default: [],
      },
      commitment: {
        type: String,
        default: "",
      },
    },
    permissions: {
      type: [String],
      enum: ["sports_admin", "lostfound_admin", "clubs_admin"],
      default: [],
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);