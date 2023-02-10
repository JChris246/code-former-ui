import express from "express";
const router = express.Router();
import { uploadFile } from "../controllers/Controller.js";

router
    .post("/", uploadFile);

export default router;