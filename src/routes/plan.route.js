const express = require("express");
const { createPlans, getPlans, deletePlans, updatePlans } = require("../controller/plan.controller");
const planRoutes = express.Router();
const jwt = require('jsonwebtoken');

//Middle Ware
const authMiddleWare = async (req, res, next) => {
    const token = req.headers["authorization"];
    try {
        if (!token) {
            return res.status(400).send({
                data: [],
                message: "Unauthorized Person",
                flag: false,
                desc: ''
            });
        } else if (token) {
            const verification = jwt.decode(token, "FITNESS_SECRET");
            if (verification.role === "Owner") {
                next();
            } else {
                return res.status(400).send({
                    data: [],
                    message: "Unauthorized Person",
                    flag: false,
                    desc: ''
                });
            }
        }
    } catch (error) {
        console.log('error:', error)
        return res.status(400).send({
            data: [],
            message: "Error Occur",
            flag: false,
            desc: error.message
        });
    }

};
planRoutes.use(authMiddleWare)

planRoutes.get("/", async (req, res) => {
    const { data, flag, message, desc } = await getPlans();
    console.log('flag:', flag);
    if (flag) {
        return res.status(201).send({ data, message, desc });
    } else {
        return res.status(401).send({ data, message, desc });
    }
})

planRoutes.post("/", async (req, res) => {
    const { planName, months, price } = req.body;
    const { data, flag, message, desc } = await createPlans({ planName, months, price });
    console.log('flag:', flag);
    if (flag) {
        return res.status(201).send({ data, message, desc });
    } else {
        return res.status(401).send({ data, message, desc });
    }
})

planRoutes.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const { data, flag, message, desc } = await deletePlans({ id });
    console.log('flag:', flag);
    if (flag) {
        return res.status(201).send({ data, message, desc });
    } else {
        return res.status(401).send({ data, message, desc });
    }
})

planRoutes.patch("/", async (req, res) => {
    const { id, planName, months, price } = req.body;
    console.log(' id, planName, months, price:', id, planName, months, price);
    const { data, flag, message, desc } = await updatePlans({ id, planName, months, price });
    console.log('flag:', flag);
    if (flag) {
        return res.status(201).send({ data, message, desc });
    } else {
        return res.status(401).send({ data, message, desc });
    }
})

module.exports = planRoutes;