import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import type LoginSession from "./LoginSession.js";
import Index from "@entity-access/entity-access/dist/decorators/Index.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import { ReadOnlyJsonProperty } from "@entity-access/server-pages/dist/services/ModelService.js";


export const userStatuses = ["active", "blocked", "locked", "change-password", "external"] as const;
export type userStatusType = typeof userStatuses[number];

export const userRoles = ["admin", "member", "reader"] as const;
export type userRolesType = typeof userRoles[number];


@Table("Users")
@Index({
    name: "IX_Unique_UserName",
    columns: [{
        name: (x) => x.emailAddress,
        descending: false
    }],
    unique: true
})
export class User {

    @Column({ key: true, dataType: "BigInt" , generated: "identity" })
    public userID: number;

    @Column({ dataType: "Char" , length: 200 })
    public emailAddress: string;

    @Column({ dataType: "Char" , length: 200 })
    public displayName: string;

    @Column({ dataType: "AsciiChar", length: 15, default: () => "active", enum: userStatuses})
    @ReadOnlyJsonProperty
    public status: userStatusType;

    @Column({})
    public dateUpdated: DateTime;

    @Column({ dataType: "Char", enum: userRoles, length: 15, default: () => "reader"})
    public role: userRolesType;

    public sessions: LoginSession[];

}


