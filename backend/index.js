const express = require("express");
// const app = express();
const databaseConnection = require("./utils/database");
const userRouter = require("./routes/User");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

const {app,server} = require("./socket/socket")

const port = process.env.PORT || 8080;


databaseConnection().then(
    server.listen(port,()=>{
        console.log("app is working well");
    })
).catch((err)=>{
    console.log(err)
})

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow cookies and authorization headers
  };

// middleware
app.use(express.static(path.resolve(__dirname, "dist")));
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Routes
app.use("/api/auth",userRouter);

app.use((err,req,res,next)=>{
    let {message="Something Went Wrong",status=500} = err;
    res.status(status).json({
        success:false,
        message:message
    })
})