import Column from "@entity-access/entity-access/dist/decorators/Column.js";
import Table from "@entity-access/entity-access/dist/decorators/Table.js";

@Table("Configuration")
export default class Configuration<T = any> {

    @Column({ key: true, dataType: "Char", length: 200})
    name: string;

    public get value(): T {
        return (this.configValue && JSON.parse(this.configValue)) || null;
    }

    public set value(v: T) {
        this.configValue = JSON.stringify(v);
    }

    @Column({ dataType: "Char", columnName: "value"})
    private configValue: string;

}