import Inject, { RegisterSingleton } from "@entity-access/entity-access/dist/di/di.js";
import SocketService from "@entity-access/server-pages/dist/socket/SocketService.js";

import pg from "pg";
import LiveTraceNamespace from "./namespaces/LiveTraceNamespace.js";
import { globalEnv } from "../globalEnv.js";
import { createAdapter } from "@socket.io/postgres-adapter";
const { Pool } = pg;
@RegisterSingleton
export default class AppSocketService extends SocketService {

    @Inject
    public live: LiveTraceNamespace;

    async init() {
        const pool = new Pool({
            ... globalEnv.db
        });
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS socket_io_attachments (
                id          bigserial UNIQUE,
                created_at  timestamptz DEFAULT NOW(),
                payload     bytea
            );
        `);
        
        this.server.adapter(createAdapter(pool));
    }

}
