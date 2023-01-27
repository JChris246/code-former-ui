const { createLogger, format, transports } = require("winston");
const { printf, combine, timestamp } = format;

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const prodFormat = printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${String(message).trim()}`);

const ProductionLogger = () => {
    return createLogger({
        levels,
        level: "http",
        format: combine(
            timestamp({ format: "YYYY-MM-DD @ HH:mm:ss" }),
            prodFormat
        ),
        transports: [
            new transports.File({ filename: global.LOG_DIR + "/error.log", level: "error" }),
            new transports.File({ filename: global.LOG_DIR + "/combined.log" }),
        ],
    });
};

module.exports = ProductionLogger;