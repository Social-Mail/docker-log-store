import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import { RelateTo } from "@entity-access/entity-access/dist/decorators/Relate.js";
import Sql from "@entity-access/entity-access/dist/sql/Sql.js";
import TraceSource from "./TraceSource.js";
import Index from "@entity-access/entity-access/dist/decorators/Index.js";

@Table("Traces")
@Index({
    name: "IX_Traces_Pending",
    columns: [
        { name: (x) => x.traceID, descending: false },
    ],
    filter: (x) => x.pending === true
})
export default class Trace {

    @Column({ dataType: "BigInt", generated: "identity", key: true })
    public traceID: number;

    @Column({ dataType: "BigInt"})
    @RelateTo(TraceSource, {
        property: (x) => x.source,
        inverseProperty: (x) => x.traces,
        foreignKeyConstraint: {
            onDelete: "restrict"
        }
    })
    public sourceID: number;

    @Column({ default: () => Sql.date.now() })
    public dateCreated: DateTime;

    @Column({ dataType: "Char", length: 50, default: () => "log" })
    public type: string;

    @Column({ dataType: "Char", length: 200, default: () => "localhost"})
    public host: string;

    @Column({ dataType: "Char", length: 200, default: () => "group"})
    public containerGroup: string;

    @Column({ dataType: "Char", length: 200, default: () => "container"})
    public container: string;

    @Column({ dataType: "Char", length: 200, nullable: true })
    public session: string;

    @Column({ dataType: "Char", length: 400, nullable: true })
    public url: string;

    @Column({ dataType: "Char", length: 100, nullable: true })
    public ipAddress: string;

    @Column({ dataType: "Char", length: 100, nullable: true })
    public userAgent: string;

    @Column({ dataType: "Char", length: 100, nullable: true })
    public title: string;

    @Column({ dataType: "Char", nullable: true })
    public error: string;

    @Column({ dataType: "Char", nullable: true })
    public cause: string;

    @Column({ dataType: "Char", nullable: true })
    public at: string;

    @Column({ dataType: "Char", nullable: true })
    public json: string;

    @Column({ dataType: "Boolean", default: () => true})
    public pending: boolean;

    public source: TraceSource;


}