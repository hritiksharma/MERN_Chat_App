const express = require('express');
const dotenv = require('dotenv');
const app = express();

const connectDb = require('./config/db');
const colors = require("colors")
const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares")

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDb();
app.get("/", (req, res) => {
    res.send("API IS RUNNING")
})
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.cyan.bold);
})