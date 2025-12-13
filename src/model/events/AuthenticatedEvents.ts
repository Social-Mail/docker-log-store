import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import BaseEvents from "./BaseEvents.js";
import ChangeEntry from "@entity-access/entity-access/dist/model/changes/ChangeEntry.js";
import { ForeignKeyFilter } from "@entity-access/entity-access/dist/model/events/EntityEvents.js";

const done = Promise.resolve();

/**
 * Everybody can read the entity.
 * But only Admin can modify.
 */
export default class AuthenticatedEvents<T> extends BaseEvents<T> {
    filter(query: IEntityQuery<T>): IEntityQuery<T> {
        if (this.verify) {
            this.sessionUser.ensureLoggedIn();
        }
        return query;
    }

    modify(query: IEntityQuery<T>): IEntityQuery<T> {
        if (this.verify) {
            this.sessionUser.ensureIsAdmin();
        }
        return query;
    }

    delete(query: IEntityQuery<T>): IEntityQuery<T> {
        if (this.verify) {
            this.sessionUser.ensureIsAdmin();
        }
        return query;
    }

    beforeInsert(entity: T, entry: ChangeEntry<T>): void | Promise<void> {
        if (this.verify) {
            this.sessionUser.ensureIsAdmin();
        }
        return done;
    }

    beforeUpdate(entity: T, entry: ChangeEntry<T>): void | Promise<void> {
        if (this.verify) {
            this.sessionUser.ensureIsAdmin();
        }
        return done;
    }

    beforeDelete(entity: T, entry: ChangeEntry<T>): void | Promise<void> {
        if (this.verify) {
            this.sessionUser.ensureIsAdmin();
        }
        return done;
    }

    onForeignKeyFilter(filter: ForeignKeyFilter<T, any>): IEntityQuery<any> {
        if(this.verify) {
            if (this.sessionUser.isAdmin) {
                return null;
            }
        }
        // following is commented as it is not sure why it was added.
        // return filter.read().where({}, (p) => (x) => false);

        return super.onForeignKeyFilter(filter);
    }
}