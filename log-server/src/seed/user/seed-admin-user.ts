/* eslint-disable no-console */
import { ServiceProvider } from "@entity-access/entity-access/dist/di/di.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import AppDbContext from "../../model/AppDbContext.js";
import { globalEnv } from "../../globalEnv.js";

export default async function seedAdminUser(scope: ServiceProvider, context: AppDbContext) {

    const { adminEmail } = globalEnv; 

    const adminUser = await context.users.where({ userName: adminEmail }, (p) => (x) => x.userName === p.userName).first();
    if (!adminUser) {
        context.users.add({
            userName: adminEmail,
            displayName: "Administrator",
            role: "admin",
            dateUpdated: DateTime.now,
        });

        await context.saveChanges();
        console.log(`Admin User Created...`);
    } else {
        console.log(`Admin User exists ${adminUser.userName}, no need to create any user.`);
    }
}