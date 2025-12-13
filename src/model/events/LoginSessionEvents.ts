import EntityEvents, { ForeignKeyFilter } from "@entity-access/entity-access/dist/model/events/EntityEvents.js";
import LoginSession from "../entities/LoginSession.js";
import ChangeEntry from "@entity-access/entity-access/dist/model/changes/ChangeEntry.js";
import Inject from "@entity-access/entity-access/dist/di/di.js";
import EntityAccessError from "@entity-access/entity-access/dist/common/EntityAccessError.js";
import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import AppDbContext from "../AppDbContext.js";
import { SessionUser } from "@entity-access/server-pages/dist/core/SessionUser.js";
import ExternalQuery from "@entity-access/server-pages/dist/decorators/ExternalQuery.js";
import { randomInt } from "node:crypto";
import nodemailer from "nodemailer";
import { globalEnv } from "../../globalEnv.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";


export default class LoginSessionEvents extends EntityEvents<LoginSession> {

    @Inject
    private db: AppDbContext;

    @Inject
    private sessionUser: SessionUser;

    @ExternalQuery
    currentUser() {
        const { sessionID = 0, userID = 0 } = this.sessionUser;
        return this.db.loginSessions
            .where({ sessionID, userID}, (p) => (x) => x.sessionID === p.sessionID
                && x.userID === p.userID);
    }

    filter(query: IEntityQuery<LoginSession>): IEntityQuery<LoginSession> {
        const { userID } = this.sessionUser;
        if (!userID) {
            throw new EntityAccessError();
        }
        return query.where({ userID }, (p) => (x) => x.userID === p.userID);
    }

    modify(query: IEntityQuery<LoginSession>): IEntityQuery<LoginSession> {

        const { userID, sessionID } = this.sessionUser;

        if (!userID) {
            // this is special case when login is not successful
            // as we still need to verify totp and complete change password.
            return query.where({ sessionID}, (p) => (x) => x.sessionID === p.sessionID);
        }

        return query.where({ userID, sessionID }, (p) => (x) => x.userID === p.userID && x.sessionID === p.sessionID);
    }

    delete(query: IEntityQuery<LoginSession>): IEntityQuery<LoginSession> {
        throw new EntityAccessError();
    }

    async beforeInsert(entity: LoginSession, entry: ChangeEntry) {

        entity.code = randomInt(9999,99999) + "";

        entity.userName = entity.userName.toLowerCase();

        // get user...
        const appUser = await this.db.users
            .where(entity, (p) => (x) => x.userName === p.userName)
            .first();

        if(!appUser) {
            throw new EntityAccessError(`User not ${entity.userName} registered`);
        }

        const { host, port, username: user, password: pass, fromName: name, fromAddress: address } = globalEnv.smtp;

        // send email...
        const transporter = nodemailer.createTransport({ host, port, auth: { user, pass }} as any);

        const result = await transporter.sendMail({
            from: { address, name },
            to: entity.userName,
            subject: `Your verification code for login ref: ${DateTime.now.msSinceEpoch.toString(36)}`,
            html: Buffer.from(`
                <div>
                    You are trying to login to docker log service store.<br/>
                    <br/>
                    To login, please enter following code,<br/>
                    <pre style="font-size=20px">${entity.code}<pre><br/>
                    <br/>
                    <br/>
                    If you have not trying to login, please do not forward this email to anyone,
                    and contact your administrator.
                </div>
            `)
        });

        if(!result.accepted?.length) {
            console.log(`could not send email to ${entity.userName}, ${result.rejectedErrors?.join("\n")}`)
        }
    }

    onForeignKeyFilter(filter: ForeignKeyFilter<LoginSession, any>): IEntityQuery<any> {
        // before login there may not be any relations set
        // so we need to ignore userID set on loginSession
        if (filter.is((x) => x.userID)) {
            return null;
        }
        return filter.modify();
    }

    preJson(entity: LoginSession): LoginSession {
        entity.code = "";
        return entity;
    }

}