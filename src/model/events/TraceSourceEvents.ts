import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import TraceSource from "../entities/TraceSource.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";
import ChangeEntry from "@entity-access/entity-access/dist/model/changes/ChangeEntry.js";
import Inject from "@entity-access/entity-access/dist/di/di.js";
import AppDbContext from "../AppDbContext.js";
import { randomUUID } from "node:crypto";

export default class TraceSourceEvents extends AuthenticatedEvents<TraceSource> {

    @Inject
    db: AppDbContext;

    filter(query: IEntityQuery<TraceSource>) {
        if (!this.verify) {
            return query;
        }
        if (this.sessionUser.isAdmin) {
            return query;
        }
        return query.where(void 0, (p) => (x) => x.sourceID === 0);
    }

    beforeInsert(entity: TraceSource, entry: ChangeEntry<TraceSource>): void | Promise<void> {
        entity.secret = randomUUID();
        entity.displaySecret = entity.secret;
    }

    preJson(entity: TraceSource): TraceSource {
        delete entity.secret;
        return entity;
    }

}