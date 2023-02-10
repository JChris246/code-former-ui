import { execaCommand } from "execa";
import fs from "fs";
import path from "path";
import setup from "./logger/index.js";

import dotenv from "dotenv";
dotenv.config();

const isValid = ({ input, weight, upscale }) => {
    const { logger } = setup(false);
    if (!input) {
        logger.error("Cannot run without an input file");
        return false;
    }

    if (!fs.existsSync(input)) {
        logger.error(input + " does not exist");
        return false;
    }

    if (Number(weight) === "NaN") {
        logger.error("weight is not a number: " + weight);
        return false;
    }

    weight = Number(weight);
    if (weight < 0 || weight > 1) {
        logger.error("weight must between 1 and 0 (inclusive): " + weight);
        return false;
    }

    // if scale was provided (ie. is not null undefined or 0),
    // check if it is 1, 2, 3 or 4
    // if not return false
    let scale = Number(upscale);
    if (scale !== 1 && scale !== 2 && scale !== 3 && scale !== 4) {
        return !upscale;
    }

    return true;
};

const addArgs = ({ input, weight, face, bg, aligned, upscale }) => {
    let command = "";

    weight = Number(weight);
    command += " -w " + weight;

    if (face) {
        command += " --face_upsample";
    }

    if (bg) {
        command += " --bg_upsampler realesrgan";
    }

    if (aligned) {
        command += " --has_aligned";
    }

    if (upscale) {
        command += " --upscale " + upscale;
    }

    command += " --input_path " + input;
    command += " --output_path " + process.env.TEMP_DIR;

    return command;
};

const run = ({ options: { input, weight, face, bg, aligned, upscale }, onComplete }) => {
    const { logger } = setup(false);
    if (!isValid({ input, weight, upscale })) {
        return null;
    }

    let command = "python " + global.CODE_FORMER_PATH;
    command += addArgs({ input, weight, face, bg, aligned, upscale });

    logger.debug(command);

    const pureName = path.basename(input).slice(0, -path.extname(input).length);
    const output = "final_results/" + pureName + ".png";

    const process = execaCommand(command);
    process.stdout.on("data", (data) => logger.info(data));
    process.then(() => {
        if (onComplete)
            onComplete({ success: true, result: output, command, id: process.pid });
        logger.info("Completed " + process.pid);
    });
    process.catch((e) => {
        if (onComplete)
            onComplete({ success: false, reason: e.message, command, id: process.pid });
        logger.error("Process failed: " + command);
    });
    return process.pid;
};

export { run };
