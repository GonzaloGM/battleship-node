const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

UserSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique."
});

UserSchema.pre("save", async function userPreSave(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.isPasswordValid = async function isPasswordValid(password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

// hide password when returning user
UserSchema.set("toJSON", {
  transform: (doc, ret, opt) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
