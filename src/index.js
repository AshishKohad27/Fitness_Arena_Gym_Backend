//1.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require('compression');

//2. routes
const { userRoutes, planRoutes, customerRoutes } = require("./routes/allRoutes");

//3.connect
const connect = require("./config/db");

//4. port
const PORT = process.env.PORT;

//5.create
const app = express();

//6.use
app.use(express.json());
app.use(compression());
app.use(cors());
app.use("/user", userRoutes);
app.use("/plan", planRoutes);
app.use("/customer", customerRoutes);

//7.listen
app.listen(PORT, async () => {
    await connect();
    console.log(`Listening on http://localhost:${PORT}`);
});
