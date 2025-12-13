import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import Configuration from "../entities/Configuration.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";
import ChangeEntry from "@entity-access/entity-access/dist/model/changes/ChangeEntry.js";

export default class ConfigurationEvents extends AuthenticatedEvents<Configuration> {

    filter(query: IEntityQuery<Configuration>): IEntityQuery<Configuration> {
        this.sessionUser.ensureIsAdmin();
        return query;
    }

    modify(query: IEntityQuery<Configuration>): IEntityQuery<Configuration> {
        this.sessionUser.ensureIsAdmin();
        return query;
    }

    delete(query: IEntityQuery<Configuration>): IEntityQuery<Configuration> {
        this.sessionUser.ensureIsAdmin();
        return query;
    }

    beforeInsert(entity: Configuration, entry: ChangeEntry): void | Promise<void> {
        this.sessionUser.ensureIsAdmin();
    }

    beforeUpdate(entity: Configuration, entry: ChangeEntry): void | Promise<void> {
        this.sessionUser.ensureIsAdmin();
    }

    beforeDelete(entity: Configuration, entry: ChangeEntry): void | Promise<void> {
        this.sessionUser.ensureIsAdmin();
    }

}