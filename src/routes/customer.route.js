const express = require("express");
const jwt = require("jsonwebtoken");
const {
    createCustomer,
    getCustomer,
    updateCustomerPlan,
    getHistory,
    getSingleCustomer,
    checkingExpire,
} = require("../controller/customer.controller");
const customerRoutes = express.Router();

const authMiddleware = async (req, res, next) => {
    const token = req.headers["authorization"];
    try {
        if (!token) {
            return res.status(400).send({
                data: [],
                message: "Unauthorized Person",
                flag: false,
                desc: "",
            });
        } else if (token) {
            const verification = jwt.decode(token, "FITNESS_SECRET");
            // console.log('verification:', verification)
            if (verification.role === "Employee" || verification.role === "Owner") {
                req.userId = verification.id;
                next();
            } else {
                return res.status(400).send({
                    data: [],
                    message: "Unauthorized Person",
                    flag: false,
                    desc: "",
                });
            }
        }
    } catch (error) {
        console.log("error:", error);
        return res.status(400).send({
            data: [],
            message: "Error Occur",
            flag: false,
            desc: error.message,
        });
    }
};

customerRoutes.post("/", authMiddleware, async (req, res) => {
    const { customerId, plan, history, _id } = req.body;
    // console.log('customerId, plan, details:', customerId, plan, details)
    const { data, flag, message, desc } = await createCustomer({
        assignedBy: req.userId,
        customerId,
        plan,
        history,
        _id,
    });
    if (flag) {
        return res.status(201).send({ data, message, desc });
    } else {
        return res.status(401).send({ data, message, desc });
    }
});

customerRoutes.get("/", authMiddleware, async (req, res) => {
    const { data, flag, message, desc } = await getCustomer();
    if (flag) {
        return res.status(201).send({ data, message, desc });
    } else {
        return res.status(401).send({ data, message, desc });
    }
});

customerRoutes.patch("/:customerPlanId", authMiddleware, async (req, res) => {
    const { customerPlanId } = req.params;
    const { plan } = req.body;
    const { data, flag, message, desc } = await updateCustomerPlan({
        customerPlanId,
        plan,
        assignedBy: req.userId,
    });
    if (flag) {
        return res.status(201).send({ data, message, desc });
    } else {
        return res.status(401).send({ data, message, desc });
    }
});

customerRoutes.post("/history", authMiddleware, async (req, res) => {
    const { customerId } = req.body;
    // req.query: directly access the parsed query string parameters
    // req.params: directly access the parsed route parameters from the path
    const { data, flag, message, desc } = await getHistory({ customerId });
    if (flag) {
        return res.status(201).send({ data, message, desc });
    } else {
        return res.status(401).send({ data, message, desc });
    }
});

customerRoutes.get("/checkingExpiry", authMiddleware, async (req, res) => {
    console.log("hey")
    const { data, flag, message, desc } = await checkingExpire();
    if (flag) {
        return res.status(201).send({ data, message, desc });
    } else {
        return res.status(401).send({ data, message, desc });
    }
})

customerRoutes.get("/:id", authMiddleware, async (req, res) => {
    const customerId = req.params.id;

    console.log('customerId:', customerId)
    const { data, flag, message, desc } = await getSingleCustomer({ customerId });
    if (flag) {
        return res.status(201).send({ data, message, desc });
    } else {
        return res.status(401).send({ data, message, desc });
    }
});


module.exports = customerRoutes;
