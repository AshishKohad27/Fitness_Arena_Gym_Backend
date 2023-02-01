const planModel = require("../model/plan.model");

const createPlans = async ({ planName, months, price }) => {
    try {
        let plan = new planModel({ planName, months, price });
        await plan.save();
        return {
            data: plan,
            flag: true,
            message: "Plan Created Successfully",
            desc: "",
        };
    } catch (e) {
        return {
            data: [],
            flag: false,
            message: "Error occurs",
            desc: e.message,
        };
    }
};

const getPlans = async () => {
    try {
        let plan = await planModel.find();
        return {
            data: plan,
            flag: true,
            message: "Plans of Fitness Arena Gyms",
            desc: "",
        };
    } catch (e) {
        return {
            data: [],
            flag: false,
            message: "Error Occurs",
            desc: e.message,
        };
    }
};

const deletePlans = async ({ id }) => {
    try {
        await planModel.deleteOne({ _id: id });
        let updatedPlan = await planModel.find();
        return {
            data: updatedPlan,
            flag: true,
            message: "Plan Delete Successfully",
            desc: "",
        };
    } catch (e) {
        return {
            data: [],
            flag: false,
            message: "Error Occurs",
            desc: e.message,
        };
    }
};

const updatePlans = async ({ id, planName, months, price }) => {
    try {
        await planModel.findByIdAndUpdate({ _id: id }, { planName, months, price });
        let updatedPlan = await planModel.find();
        return {
            data: updatedPlan,
            flag: true,
            message: "Plan Update Successfully",
            desc: "",
        };
    } catch (e) {
        return {
            data: [],
            flag: false,
            message: "Error Occurs",
            desc: e.message,
        };
    }
};


module.exports = { createPlans, getPlans, deletePlans, updatePlans };
