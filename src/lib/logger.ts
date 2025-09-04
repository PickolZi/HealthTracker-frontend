import { createLogger, format, transports } from "winston";

const logger = createLogger({
	level: process.env.LOG_LEVEL || "info",
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.printf(({ timestamp, level, message, ...meta }) => {
			return `${timestamp} [${level.toUpperCase()}]: ${message} ${
				Object.keys(meta).length ? JSON.stringify(meta) : ""
			}`;
		})
	),
	transports: [new transports.Console()],
});

export default logger;
