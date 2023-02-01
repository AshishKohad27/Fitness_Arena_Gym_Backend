const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ["Owner", "Employee", "Customer"],
        default: "Customer",
    }
});

const userModel = model("user", userSchema);

module.exports = userModel;