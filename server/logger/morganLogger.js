import morgan from "morgan";

const getMorganLogger = (logger) => {
    // Build the morgan middleware
    return morgan(
        // Define message format string (this is the default one).
        ":method :url :status :res[content-length] - :response-time ms",
        // Options: overwrite the stream logic.
        {
            // Override the stream method by telling
            // Morgan to use our custom logger instead of the console.log.
            stream: {
                write: (message) => logger.http(message),
            }
        }
    );
};

export default getMorganLogger;
