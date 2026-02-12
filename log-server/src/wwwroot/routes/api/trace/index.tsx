import Content from "@entity-access/server-pages/dist/Content.js";
import Page from "@entity-access/server-pages/dist/Page.js";
import AppDbContext from "../../../../model/AppDbContext.js";
import TimedCache from "@entity-access/entity-access/dist/common/cache/TimedCache.js";
import { Prepare } from "@entity-access/server-pages/dist/decorators/Prepare.js";
import AppSocketService from "../../../../socket/SocketService.js";
import { globalServices } from "../../../../globalServices.js";
import Sql from "@entity-access/entity-access/dist/sql/Sql.js";

const cache = new TimedCache<string,number>();

const getSourceID = (key: string) =>
    cache.getOrCreateAsync(key, async (k) => {
        const scope = globalServices.createScope();
        const db = scope.resolve(AppDbContext);
        const q = db.traceSources
            .where({ k}, (p) => (x) => x.secret === p.k);
        const user = await q.firstOrFail();
        await q.update(void 0, (p) => (x) => ({ lastUsed: Sql.date.now()}));
        return user.sourceID;
    });

@Prepare.parseJsonBody
export default class extends Page {

    async run() {

        const key = this.request.headers["x-key"] || this.childPath[0];
        if (!key) {
            return Content.nativeJson({}, { status: 401 });
        }

        const sourceID = await getSourceID(key as any);

        const db = this.resolve(AppDbContext);
        db.raiseEvents = false;
        db.verifyFilters = false;

        const { type = "log", ipAddress, error, cause, title, container, host, session, url } = this.body;

        const { traceID } = await db.traces.statements.insert({
            sourceID,
            type,
            ipAddress,
            error,
            host,
            container,
            session,
            url,
            cause,
            title,
            json: JSON.stringify(this.body)
        });

        const ss = this.resolve(AppSocketService);
        ss.live.send(sourceID, { traceID });
        ss.live.send("*", { traceID });

        return Content.nativeJson({ traceID });
    }

}