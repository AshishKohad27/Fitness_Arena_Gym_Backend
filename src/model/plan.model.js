const { Schema, model } = require("mongoose");

const planSchema = new Schema({
    planName: { type: String, require: true },
    months: { type: String, require: true },
    price: { type: String, require: true },
});

const planModel = model("plan", planSchema);

module.exports = planModel;
