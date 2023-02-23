const { Schema, model, default: mongoose } = require("mongoose");

const historySchema = new Schema({
    plan: { type: Object },
    gymSideHistory: { type: Object }

});

const historyModel = model("history", historySchema);

module.exports = historyModel;
