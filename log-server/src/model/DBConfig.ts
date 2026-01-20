import { IClassOf } from "@entity-access/entity-access/dist/decorators/IClassOf.js";
import Inject, { RegisterScoped } from "@entity-access/entity-access/dist/di/di.js";
import EntityAccessError from "@entity-access/entity-access/dist/common/EntityAccessError.js";
import Configuration from "../model/entities/Configuration.js";
import AppDbContext from "./AppDbContext.js";

export class UIPackageConfig {
    public package: string;
    public version: string;
    public view: string;
}

export class ConfigItem<T> {

    public get value() {
        return this.item.value as Partial<T>;
    }

    public set value(v: Partial<T>) {
        this.item.value = v;
    }

    constructor(
        private item: Configuration,
        private config: DBConfig,
        private type: IClassOf<T>
    ) {

    }

    public async update() {
        await this.config.save(this.type, this.value);
    }
}

@RegisterScoped
export default class DBConfig {


    @Inject
    private context: AppDbContext;

    public async getOrCreate<T>(type: IClassOf<T>, defaults: Partial<T> = {}) {
        const name = type.name;
        const c = await this.context.configurations.saveDirect({
            keys: {
                name
            },
            mode: "selectOrInsert",
            changes: {
                name,
                configValue: "{}"
            } as any
        });
        return new ConfigItem(c, this, type);
    }

    public async get<T>(type: IClassOf<T>) {
        const name = type.name;
        const c = await this.context.configurations.where({ name }, (p) => (x) => x.name === p.name).first();
        if (!c) {
            throw new EntityAccessError(`${type.name} configuration does not exist`);
        }
        return c.value as T;
    }

    public async set<T>(values: T) {
        const c = Object.getPrototypeOf(values)?.constructor;
        if (c === Object) {
            throw new EntityAccessError(`Config must not be an object but an instance of a class`);
        }
        return this.save(c, values);
    }

    public async save<T>(c: IClassOf<T>, values: Partial<T>, seed = false) {

        const name = c.name;

        let config = await this.context.configurations.where({ name }, (p) => (x) => x.name === p.name).first();
        if (!config) {
            config = this.context.configurations.add({
                name
            });
        } else {
            if (seed) {
                return;
            }
        }
        config.value = values;
        await this.context.saveChanges();
        return c;
    }

}
