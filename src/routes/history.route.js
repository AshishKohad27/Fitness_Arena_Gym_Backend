const express = require("express");
const customerModel = require("../model/customer.model");
const historyRoute = express.Router();

const initial = [
    customerId = "",
    AllPlansOfCustomerId = [
        {
            plan: Object,
            assignedBy: Object,
        }
    ],
]

historyRoute.post("/", async (req, res) => {
    const customerFind = await customerModel({ _id: customerId });
    customerFind.AllPlansOfCustomerId.push({
        
    })
})

module.exports = historyRoute;