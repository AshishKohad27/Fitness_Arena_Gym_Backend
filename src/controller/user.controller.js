const userModel = require("../model/user.model");
const getCustomerByQuery = async ({ query }) => {
  try {
    let users = await userModel.find({
      email: { $regex: query, $options: "i" },
      $caseSensitive: false,
      role: "Customer",
    });
    return {
      data: users,
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

module.exports = { getCustomerByQuery };
