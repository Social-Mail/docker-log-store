import { User } from "../entities/User.js";
import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import Inject from "@entity-access/entity-access/dist/di/di.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";
import EntityAccessError from "@entity-access/entity-access/dist/common/EntityAccessError.js";
import ChangeEntry from "@entity-access/entity-access/dist/model/changes/ChangeEntry.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import Sql from "@entity-access/entity-access/dist/sql/Sql.js";
import AppDbContext from "../AppDbContext.js";

export default class UserEvents extends AuthenticatedEvents<User> {

    @Inject
    private db: AppDbContext;

    filter(query: IEntityQuery<User>): IEntityQuery<User> {

        if (this.sessionUser.isAdmin) {
            return query;
        }

        const active = ["active", "locked", "change-password"];
        const q = query.where({ active }, (p) => (x) => Sql.in(x.status, p.active));
        return q;
    }

    modify(query: IEntityQuery<User>): IEntityQuery<User> {
        if (this.sessionUser.isAdmin) {
            return query;
        }

        const { userID } = this.sessionUser;
        return query.where({ userID }, (p) => (x) => x.userID === p.userID);
    }

    async beforeInsert(entity: User, entry: ChangeEntry) {
        this.sessionUser.ensureIsAdmin();
        const { userName } = entity;
        const now = DateTime.now;
        entity.dateUpdated = now;
        const existing = await this.db.users.where({ userName }, (p) => (x) => x.userName === p.userName).first();
        if (existing) {
            throw new EntityAccessError("Username already exists");
        }

    }

    async beforeUpdate(entity: User, entry: ChangeEntry<User>) {
        const { userName, userID } = entity;
        entity.dateUpdated = DateTime.now;
        const existing = await this.db.users.where({ userName, userID }, (p) => (x) => x.userName === p.userName && x.userID !== p.userID).first();
        if (existing) {
            throw new EntityAccessError("Username already exists");
        }

        if (entry.isModified("status")) {
            if (this.verify && !this.sessionUser.isAdmin) {
                throw new EntityAccessError("Only administrator can modify the status");
            }
        }

    }

    async afterUpdate(entity: User, entry: ChangeEntry<User>) {
        if (entry.isUpdated("status")) {
            if (entity.status === "blocked") {
                const now = new Date();
                const { userID } = entity;
                const sessions = await this.db.loginSessions.where({ userID, now }, (p) => (x) => x.userID
                    && x.invalid === false
                    && x.expiry > p.now)
                    .select(void 0, () => (x) => ({ sessionID: x.sessionID })).toArray();
                for (const keys of sessions) {
                    await this.db.loginSessions.saveDirect({ mode: "update", keys, changes: { invalid: true } });
                }
            }
        }
    }

}