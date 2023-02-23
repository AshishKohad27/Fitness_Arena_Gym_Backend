const { Schema, model, default: mongoose } = require("mongoose");

const yearSchema = new Schema({
    year: {
        type: Object,
        require: true,
    }
});

const yearModel = model("year", yearSchema);

module.exports = yearModel;
