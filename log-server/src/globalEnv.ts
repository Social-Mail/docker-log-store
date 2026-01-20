import { availableParallelism } from "node:os";


const isTestMode = (process.env.DOCKER_LOG_STORE_TEST_MODE ?? "false") === "true";

let port = process.env.PORT as any;
if (/^\d+$/i.test(port)) {
    port = Number(port);
}

const host = process.env.TRACER_HOST;

export const globalEnv = {
    host,
    port,
    isTestMode,
    adminEmail: process.env.DOCKER_LOG_STORE_ADMIN_EMAIL,
    smtp: {
        fromName: process.env.DOCKER_LOG_STORE_SMTP_FROM_NAME,
        fromAddress: process.env.DOCKER_LOG_STORE_SMTP_FROM_ADDRESS,
        host: process.env.DOCKER_LOG_STORE_SMTP_HOST,
        port: process.env.DOCKER_LOG_STORE_SMTP_PORT ?? 587,
        username: process.env.DOCKER_LOG_STORE_SMTP_USERNAME,
        password: process.env.DOCKER_LOG_STORE_SMTP_PASSWORD,
    },
    db: {
        database: process.env.DOCKER_LOG_STORE_DB_DATABASE ?? "Tracer",
        host: process.env.DOCKER_LOG_STORE_DB_HOST ?? "localhost",
        port: Number(process.env.DOCKER_LOG_STORE_DB_PORT ?? 5432),
        ssl: JSON.parse(process.env.DOCKER_LOG_STORE_DB_SSL ?? "true"),
        user: process.env.DOCKER_LOG_STORE_DB_USER ?? "postgres",
        password: process.env.DOCKER_LOG_STORE_DB_PASSWORD ?? "abcd123",
    },
    numCPUs: isTestMode
        ? 2
        : (process.env.DOCKER_LOG_STORE_CLUSTER_WORKERS
            ? Number(process.env.DOCKER_LOG_STORE_CLUSTER_WORKERS)
            : availableParallelism())
};
