import DBConfig, { UIPackageConfig } from "../../model/DBConfig.js";

export default async function seedUI(config: DBConfig) {

    await config.save(UIPackageConfig, {
        package: "@entity-access/tracer-client",
        view: "dist/web/AppIndex",
        version: "1.0.16"
    });
}
