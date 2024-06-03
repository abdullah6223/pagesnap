import { Logger, pino } from "pino";

const level: string = process.env.LOG_LEVEL ?? "info";

export const logger: Logger = pino({ name: "pagesnap", level });
