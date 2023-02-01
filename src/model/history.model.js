const { Schema, model, default: mongoose } = require("mongoose");

const historySchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    AllPlansOfCustomerId: {
        type: Array,
    }

    // AllPlansOfCustomerId: {
    //     type: [
    //         {
    //             Date: {
    //                 startDate: String,
    //                 expiryDate: String,
    //             },
    //             plan: Object,
    //             assignedBy: Object,
    //         }
    //     ]
    // },

});

const historyModel = model("history", historySchema);

module.exports = historyModel;
