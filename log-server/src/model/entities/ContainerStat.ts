import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import Sql from "@entity-access/entity-access/dist/sql/Sql.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";

@Table("ContainerStats")
export default class ContainerStat {

    @Column({ dataType: "BigInt", key: true, generated: "identity"})
    containerStatID: number;

    @Column({ dataType: "DateTime", default: () => Sql.date.now()})
    time: DateTime;

    @Column({ dataType: "Char", length: 400 })
    name: string;

    @Column({ dataType: "Char", length: 50 })
    state: string;

    @Column({ dataType: "Char", length: 50 })
    status: string;

    @Column({ dataType: "Char" })
    image: string;

    @Column({ dataType: "Char" })
    imageID: string;

    @Column({ dataType: "Char" })
    command: string;

    @Column({ dataType: "BigInt" })
    sizeRootFs: number;

    @Column({ dataType: "BigInt" })
    sizeRw: number;

    @Column({ dataType:"Char" })
    ports: string;

    @Column({ dataType:"Char" })
    processes: string;

    @Column({ dataType: "Decimal", default: () => 0})
    cpu: number;

    @Column({ dataType: "Decimal", default: () => 0})
    memory: number;
}