import { availableParallelism } from "node:os";


const isTestMode = (process.env.LOGGER_SERVER_TEST_MODE ?? "false") === "true";

let port = process.env.PORT as any;
if (/^\d+$/i.test(port)) {
    port = Number(port);
}

const host = process.env.TRACER_HOST;

export const globalEnv = {
    host,
    port,
    isTestMode,
    adminEmail: process.env.ADMIN_EMAIL,
    smtp: {
        fromName: process.env.SMTP_FROM_NAME,
        fromAddress: process.env.SMTP_FROM_ADDRESS,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ?? 587,
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD,
    },
    db: {
        database: process.env.TRACER_DB_DATABASE ?? "Tracer",
        host: process.env.TRACER_DB_HOST ?? "localhost",
        port: Number(process.env.TRACER_DB_PORT ?? 5432),
        ssl: JSON.parse(process.env.TRACER_DB_SSL ?? "true"),
        user: process.env.TRACER_DB_USER ?? "postgres",
        password: process.env.TRACER_DB_PASSWORD ?? "abcd123",
    },
    numCPUs: isTestMode
        ? 2
        : (process.env.TRACER_CLUSTER_WORKERS
            ? Number(process.env.TRACER_CLUSTER_WORKERS)
            : availableParallelism())
};
