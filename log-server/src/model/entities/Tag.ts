import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";
import Index from "@entity-access/entity-access/dist/decorators/Index.js";
import { RelateTo } from "@entity-access/entity-access/dist/decorators/Relate.js";

@Table("Tags")
@Index({
    name: "IX_Tags_UniqueName",
    unique: true,
    columns: [
        { name: (x) => x.name, descending: false }
    ]
})
export default class Tag {

    @Column({ key: true, generated: "identity", dataType: "BigInt"})
    public tagID: number;

    @Column({ dataType: "Char", length: 200 })
    public name: string;

    @Column({ dataType: "BigInt", nullable: true})
    @RelateTo(Tag, {
        property: (x) => x.parent,
        inverseProperty: (x) => x.children
    })
    public parentID: number;

    public parent: Tag;

    public children: Tag[];

}