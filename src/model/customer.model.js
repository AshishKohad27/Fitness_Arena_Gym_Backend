const { Schema, model, default: mongoose } = require("mongoose");

const customerSchema = new Schema({
    startDate: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: String,
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    plan: { type: Object },
    historyLength: { type: String },
    history: {
        type: Array,
        required: true,
    },
    details: {
        type: Array,
        required: true,
    },
});

const customerModel = model("customerPlan", customerSchema);

module.exports = customerModel;
