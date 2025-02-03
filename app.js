// import express from "express";
// import mongoose from "mongoose"
// import bodyParser from "body-parser";
// import cors from "cors";


// import UserRouter from "./routes/user.route.js";
// import TeamRouter from "./routes/Team.route.js";
// import PlayerRouter from "./routes/player.route.js";
// import MatchRouter from "./routes/match.route.js";
// import TournamentRouter from "./routes/tournament.route.js";

// const app = express();
// app.use(cors());

// mongoose.connect("mongodb://localhost:27017/cricklink")
//   .then(() => {
//     console.log("Database connected...");
//     app.use(bodyParser.json());
//     app.use(bodyParser.urlencoded({ extended: true }));

//     // app.get("/",(req,res)=>{
//     //   // console.log("hey")
//     //   res.end("Done")
//     // })
//     app.use("/user", UserRouter);
//     app.use("/Team", TeamRouter);
//     app.use("/Tournament", TournamentRouter);
//     app.use("/match", MatchRouter)
//     app.use("/player", PlayerRouter);

//     app.listen(3001, () => {
//       console.log("Server Started....");
//     });

//   }).catch(err => {
//     console.log(err);
//   })


//====================================================================

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors'; // Import the cors package

import UserRouter from "./routes/user.route.js";
import TeamRouter from "./routes/Team.route.js";
import TournamentRouter from "./routes/tournament.route.js";
import PlayerRouter from "./routes/player.route.js";
import MatchRouter from "./routes/match.route.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path"
import {fileURLToPath} from "url"

const app = express();

const __file = fileURLToPath(import.meta.url);
const __dir = path.dirname(__file)


// Use CORS middleware to allow cross-origin requests from your frontend (localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000', // You can adjust this to allow specific origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Methods you want to allow
    allowedHeaders: ['Content-Type', 'Authorization'] // Headers you want to allow
}));

mongoose.connect("mongodb://localhost:27017/cricklink")
.then(() => {
  console.log("Database connected...");
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dir, 'public'))); 
  app.use("/user", UserRouter);
  app.use("/Team", TeamRouter);
  app.use("/Tournament", TournamentRouter);
  app.use("/match", MatchRouter);
  app.use("/player", PlayerRouter);
  app.use("/auth", authRoutes);

  app.listen(3001, () => {
    console.log("Server Started....");
  });

}).catch(err => {
  console.log(err);
});