import express from "express";
const router = express.Router();
import { startJob } from "../controllers/Controller.js";

router
    .post("/", startJob);

export default router;