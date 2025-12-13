import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import { RelateTo } from "@entity-access/entity-access/dist/decorators/Relate.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import Index from "@entity-access/entity-access/dist/decorators/Index.js";
import { IgnoreJsonProperty, JsonProperty } from "@entity-access/server-pages/dist/services/ModelService.js";
import { User } from "./User.js";

const loginSessionStatuses = ["created", "change-password", "totp"] as const;
export type loginStatusType = typeof loginSessionStatuses[number];

@Table("LoginSessions")
@Index({
    name: "IX_LoginSessions_DeviceTokenTypes",
    columns: [
        { name: (x) => x.deviceTokenType, descending: false },
        { name: (x) => x.status, descending: false }
    ],
    filter: (x) => x.invalid === false && x.deviceTokenType !== null
})
export default class LoginSession {

    @Column({ key: true, generated: "identity"})
    public sessionID: number;

    @Column({ dataType: "BigInt"})
    @RelateTo(User, {
        property: (ls) => ls.user,
        inverseProperty: (user) => user.sessions
    })
    public userID: number;

    @Column({})
    @IgnoreJsonProperty
    public start: Date;

    @Column({})
    @IgnoreJsonProperty
    public expiry: Date;

    @Column({})
    public invalid: boolean;

    @Column({ dataType:"Char", length: 5, nullable: true})
    public code: string;

    @Column({ })
    public dateUpdated: DateTime;

    @Column({ dataType: "AsciiChar", length: 20, nullable: true})
    public status: loginStatusType;

    @Column({ dataType: "AsciiChar", nullable: true})
    public deviceToken: string;

    @Column({ dataType: "AsciiChar", length: 50, nullable: true})
    public deviceTokenType: string;

    /**
     * This will not be saved into database
     */
    @JsonProperty()
    public userName: string;

    /**
     * This will not be saved to database, but it might be
     * sent to us via network, we will investigate if user
     * exists or not
     */
    @JsonProperty()
    public checkPassword: string;

    /**
     * You need to supply new password if user's status
     * is set to change-password
     */
    @JsonProperty()
    public newPassword: string ;


    @JsonProperty({ help: "Multi Factor Auth Token"})
    public timeToken: string;

    @JsonProperty({ help: "One Time Password"})
    public oneTimePassword: string;

    public user: User;

}
