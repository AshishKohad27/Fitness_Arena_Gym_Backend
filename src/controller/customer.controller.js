const customerModel = require("../model/customer.model");
const historyModel = require("../model/history.model");
const planModel = require("../model/plan.model");
const userModel = require("../model/user.model");

function formateDate(flag, mon = 1) {
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
    const month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    let bag = "";
    if (flag === "expire") {
        function addMonth(date, addingMonth) {
            date.setMonth(date.getMonth() + addingMonth);
            return date;
        }
        const newDate = addMonth(new Date(), mon);
        bag +=
            weekday[newDate.getDay()] +
            " " +
            newDate.getDate() +
            " " +
            month[newDate.getMonth()] +
            " " +
            newDate.getFullYear();
    }
    if (flag === "start") {
        let d = new Date();
        bag +=
            weekday[d.getDay()] +
            " " +
            d.getDate() +
            " " +
            month[d.getMonth()] +
            " " +
            d.getFullYear();
    }
    return bag;
}

const createCustomer = async ({ assignedBy, customerId, plan, details }) => {
    try {
        let findPlan = await planModel.findById({ _id: plan });
        // let assignedByPlan = await userModel.findById({ _id: assignedBy });

        let startReturn = formateDate("start");
        let expireReturn = formateDate("expire", findPlan.months);

        let attachPlan = { ...findPlan };
        let customer = new customerModel({
            startDate: startReturn,
            expiryDate: expireReturn,
            assignedBy,
            customerId,
            plan: attachPlan,
            details,
        });
        await customer.save();

        let historyGet = await historyModel.find();
        console.log("historyGet:", historyGet);

        return {
            data: customer,
            flag: true,
            message: "Customer Plan Added Successfully",
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

const getCustomer = async () => {
    try {
        let plan = await customerModel
            .find()
            .populate([
                { path: "plan" },
                { path: "assignedBy" },
                { path: "customerId" },
            ]);
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

const updateCustomerPlan = async ({ plan, assignedBy, customerPlanId }) => {
    console.log("customerPlanId:", customerPlanId);
    try {
        //Update customer plan
        let updatePlanInCustomer = await customerModel.findByIdAndUpdate(
            { _id: customerPlanId },
            { plan, assignedBy }
        );
        console.log("updatePlanInCustomer:", updatePlanInCustomer);

        return {
            data: updatePlanInCustomer,
            flag: true,
            message: "Customer Plan Update Successfully",
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

const getHistory = async ({ customerId }) => {
    try {
        const getCustomer = await customerModel
            .find({
                customerId: { _id: customerId },
            })
            .populate([
                { path: "plan" },
                { path: "assignedBy" },
                { path: "customerId" },
            ]);
        return {
            data: getCustomer,
            flag: true,
            message: `History of Customer`,
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

module.exports = {
    createCustomer,
    getCustomer,
    updateCustomerPlan,
    getHistory,
};
