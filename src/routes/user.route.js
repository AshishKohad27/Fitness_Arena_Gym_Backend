const express = require("express");
const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { getCustomerByQuery } = require("../controller/user.controller");

const userRoutes = express.Router();

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
            if (verification.role === "Owner" || verification.role === "Employee") {
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

//Get
userRoutes.get("/", async (req, res) => {
    const user = await userModel.find();
    res.send(user);
});

//Signup
userRoutes.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    const token = req.headers["authorization"];
    console.log('token:', token)
    const user = await userModel.findOne({ email });
    console.log('user:', user);

    // const hash = await argon2.hash(password);
    try {
        if (user) {
            return res.status(400).send("User with same email Id Already Exists");
        }
        else if (!token) {
            const auth = new userModel(req.body);
            await auth.save();
            return res.status(201).send("User Created Successfully");
        } else {
            const decode = jwt.decode(token, 'FITNESS_SECRET')
            console.log('decode:', decode);
            if (decode && decode.role === "Owner") {
                const auth = new userModel({ email, password, role: 'Employee' });
                await auth.save();
                return res.status(201).send("Employee Created Successfully");
            } else {
                return res
                    .status(401)
                    .send("Unauthorized Users Try to Create Employee Account");
            }
        }
    } catch (e) {
        console.log(e.message);
        return res.status(400).send(e.message);
    }
});

userRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    console.log('user:', user);

    try {
        if (!user) {
            console.log("hi")
            return res.status(400).send({ messages: "User with this email Id not Exists" });
        }
        // if (await argon2.verify(user.password, password)) {
        //jwt token
        if (user) {
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                },
                "FITNESS_SECRET",
                { expiresIn: "4 days" }
            );
            const refreshToken = jwt.sign({ id: user._id }, "REFRESH_AUTH", {
                expiresIn: "7 days",
            });
            return res.send({ message: "Login Successfully", token, refreshToken });
        }
        // } else {
        //   res.status(400).send("You enter wrong username or password");
        // }
    } catch (e) {
        return res.status(400).send("error:", e.message);
    }
});


userRoutes.post("/verify", async (req, res) => {
    const { token } = req.body;
    if (token === undefined) {
        console.log('token from verify:', token);
        return res.send("Unauthorized");
    }
    try {
        const verification = jwt.verify(token, "FITNESS_SECRET");
        console.log('verification:', verification)
        if (verification) {
            return res.status(200).send(verification);
        }
    } catch (e) {
        console.log('e:', e.message);
        if (e.message === "jwt expired") {
            // blacklist.push(token);
            console.log("blacklist:", blacklist);
        }
        return res.status(403).send("Invalid Token");
    }
});

userRoutes.get("/allcustomer", authMiddleWare, async (req, res) => {
    try {
        let user = await userModel.find({ role: "Customer" });
        return res.status(201).send({
            data: user,
            flag: true,
            message: "All Customers",
            desc: "",
        });
    } catch (e) {
        return res.status(400).send({
            data: [],
            flag: false,
            message: "Error Occurs",
            desc: e.message,
        });
    }
})


userRoutes.post("/query", authMiddleWare, async (req, res) => {
    const { query } = req.body;
    console.log('query:', query);
    const { data, flag, message, desc } = await getCustomerByQuery({ query });
    if (flag) {
        return res.status(201).send({ data, message, desc });
    } else {
        return res.status(401).send({ data, message, desc });
    }
})

module.exports = userRoutes;
