const customerModel = require("../model/customer.model");
const historyModel = require("../model/history.model");
const planModel = require("../model/plan.model");
const userModel = require("../model/user.model");
    function formateDate(flag, mon = 1) {
        let bag = "";
        if (flag === "expire") {
            function addMonth(date, addingMonth) {
                date.setMonth(date.getMonth() + addingMonth);
                return date;
            }
            const newDate = addMonth(new Date(), mon);
            bag += newDate;
        }
        if (flag === "start") {
            let d = new Date();
            bag += d;
        }
        return bag.slice(0, 15);
    }

const createCustomer = async ({ assignedBy, customerId, plan, history }) => {
    try {
        let findPlan = await planModel.findById({ _id: plan });
        let assignedByWho = await userModel.findById({ _id: assignedBy });
        let startReturn = formateDate("start");
        let expireReturn = formateDate("expire", +findPlan.months);
        let attachPlan = { ...findPlan }; // ref object
        let firstHistory = [
            {
                plan: attachPlan._doc,
                gymSideHistory: {
                    assignedBy: assignedByWho,
                    startReturn,
                    expireReturn,
                },
            },
        ];

        //User exist in system
        let cus = await userModel.findOne({ customerId });
        //User having CustomerPlanID or not
        let CustomerPlanId = await customerModel.findOne({ customerId });

        if (cus && CustomerPlanId) {
            //    Search CustomerPlanId and then update his history
            let gettingCustomerHistory = await customerModel.findOne({
                _id: CustomerPlanId._id,
            });
            let newHistory = [
                ...gettingCustomerHistory.history,
                {
                    plan: attachPlan._doc,
                    gymSideHistory: {
                        assignedBy: assignedByWho,
                        startReturn,
                        expireReturn,
                    },
                },
            ];
            let updatedCustomerPlan = await customerModel.findOneAndUpdate(
                { _id: CustomerPlanId._id },
                {
                    startDate: startReturn,
                    expiryDate: expireReturn,
                    assignedBy,
                    customerId,
                    plan: attachPlan,
                    historyLength: newHistory.length,
                    history: newHistory,
                    details: [],
                }
            );
            // console.log("updatedCustomerPlan", updatedCustomerPlan);
        } else if (cus) {
            // creating new customerPlanId;
            let saveCustomer = new customerModel({
                startDate: startReturn,
                expiryDate: expireReturn,
                assignedBy,
                customerId,
                plan: attachPlan,
                historyLength: firstHistory.length,
                history: firstHistory,
                details: [],
            });
            await saveCustomer.save();
        }

        // for history; not attached to any customerId -->stats
        let historyStorage = new historyModel({
            plan: attachPlan._doc,
            gymSideHistory: {
                assignedBy: assignedByWho,
                startReturn,
                expireReturn,
            },
        });
        await historyStorage.save();

        let customer = await customerModel.find().populate({ path: "customerId" });
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
                customerId,
            })
            .populate([
                { path: "plan" },
                { path: "assignedBy" },
                { path: "customerId" },
            ]);
        return {
            data: getCustomer || [],
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

const getSingleCustomer = async ({ customerId }) => {
    console.log("customerId:", customerId);
    try {
        let users = await userModel.findOne({ _id: customerId });
        let customerPlanId = await customerModel.find({}, { customerId });
        console.log("customerPlanId:", customerPlanId);

        return {
            data: users,
            _id: customerPlanId.length !== 0 ? customerPlanId[0]._id : "",
            flag: true,
            message: "User of Fitness Arena Gyms",
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

const checkingExpire = async () => {
    // console.log("hello");
    try {
        function Checking(startDate, expiryDate) {
            let StartResult = new Date(startDate);
            // console.log('StartResult:', StartResult)
            let endResult = new Date(expiryDate);
            // console.log('endResult:', endResult)

            let newDate = new Date(endResult - StartResult);
            // console.log("newDateMonth:", newDate.getMonth()); // IF Month is 0
            // console.log("newDateDate:", newDate.getDate()); // and date 5 3 1 -1
            if (newDate.getMonth() === 5) {
                return 5;
            } else if (newDate.getMonth() === 0 && newDate.getDate() >= 3) {
                return 3;
            } else if (newDate.getMonth() === 0 && newDate.getDate() >= 1) {
                return 1;
            } else if (newDate.getMonth() === 0 && newDate.getDate() < 0) {
                return 1;
            } else {
                return -1;
            }
        }
        let customer = await customerModel
            .find({ role: "Customer" })
            .populate({ path: "customerId" });

        let FiveDaysBefore = [];
        let ThreeDaysBefore = [];
        let oneDaysBefore = [];
        let haveToPay = [];

        // collecting all customers ids
        let obj = {};
        for (let i = 0; i < customer.length; i++) {
            obj[customer[i].customerId._id] = 1;
        }

        //last plan with particular customerId
        let stack = [];
        for (let key in obj) {
            let get = await customerModel.find({ key });
            stack.push(get[get.length - 1]);
        }
        //collect customers
        for (let i = 0; i < stack.length; i++) {
            let result = Checking(stack[i].startDate, stack[i].expiryDate);
            // console.log("result:", result);
            if (result === 5) {
                FiveDaysBefore.push(stack[i]);
            } else if (result === 3) {
                ThreeDaysBefore.push(stack[i]);
            } else if (result === 1) {
                oneDaysBefore.push(stack[i]);
            } else {
                haveToPay.push(stack[i]);
            }
        }

        let Year = {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
        };
        let PastYear = {
            2022: {},
        };
        let convertString = [
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

        let historyGetting = await historyModel.find();
        
        for (let i = 0; i < historyGetting.length; i++) {
            let d = new Date(historyGetting[i].gymSideHistory.startReturn);
            let month = convertString[d.getMonth()];
            let yearFromDate = d.getFullYear().toString();
            if (PastYear[yearFromDate] === undefined) {
                PastYear[yearFromDate] = {};
            }
            let amount = +historyGetting[i].plan.price;
            let convetMonth = month + "Amount";
            console.log('yearFromDate:', yearFromDate, month)
            if (PastYear[yearFromDate][month] === undefined) {
                PastYear[yearFromDate][month] = 1;
            } else {
                PastYear[yearFromDate][month]++;
            }

            if (PastYear[yearFromDate][convetMonth] === undefined) {
                PastYear[yearFromDate][convetMonth] = amount;
            } else {
                PastYear[yearFromDate][convetMonth] += amount
            }


            //amount


        }
        // console.log("PastYear:", PastYear);
        return {
            data: {
                obj,
                stack: stack.length,
                historyGetting: historyGetting.length,
                customer: customer.length,
                FiveDaysBefore: FiveDaysBefore.length,
                ThreeDaysBefore: ThreeDaysBefore.length,
                oneDaysBefore: oneDaysBefore.length,
                haveToPay: haveToPay.length,
                PastYear,
            },
            flag: true,
            message: "Customer of Fitness Arena Gyms",
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
    getSingleCustomer,
    checkingExpire,
};
