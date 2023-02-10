import formidable from "formidable";
import { run } from "../codeformer.js";

import dotenv from "dotenv";
dotenv.config();

// adpated from
// https://github.com/JabbR/JabbR/blob/eb5b4e2f1e5bdbb1ea91230f1884716170a6976d/JabbR/Chat.utility.js#L50
const guidGenerator = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

const getUniqueFilename = (_, ext) => guidGenerator() + ext;

export const uploadFile = async (req, res) => {
    try {
        const data = await new Promise((resolve, reject) => {
            const form = formidable({
                multiples: true,
                uploadDir: process.env.TEMP_DIR,
                filename: getUniqueFilename,
                keepExtensions: true
            });

            // form.on("fileBegin", (formname, file) => file.path = path.join(uploadDir, getUniqueFilename()));
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve(files);
            });
        });

        return res.status(201).json({ id: data.image.newFilename });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: e.message });
    }
};

export const startJob = (req, res) => {
    const { bgEnhance, faceUpsample, scale, weight, image } = req.body;

    const jobId = run({
        options: {
            input: process.env.TEMP_DIR + "/" + image,
            weight,
            face: faceUpsample,
            bg: bgEnhance,
            aligned: false,
            upscale: scale
        },
        onComplete: ({ success, reason, result, id }) => {
            if (success) {
                res.status(200).send({ id, success, image: result });
            } else {
                res.status(500).send({ id, success, msg: reason });
            }
        }
    });

    if (!jobId)
        res.status(400).send({ msg: "Invalid job request" });
};