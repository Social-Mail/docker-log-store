import { RegisterSingleton } from "@entity-access/entity-access/dist/di/di.js";
import EntityContextEvents from "@entity-access/entity-access/dist/model/events/ContextEvents.js";
import LoginSession from "./entities/LoginSession.js";
import { User } from "./entities/User.js";
import LoginSessionEvents from "./events/LoginSessionEvents.js";
import UserEvents from "./events/UserEvents.js";
import Configuration from "./entities/Configuration.js";
import ConfigurationEvents from "./events/ConfigurationEvents.js";
import Tag from "./entities/Tag.js";
import TagEvents from "./events/TagEvents.js";

@RegisterSingleton
export default class AppDbContextEvents extends EntityContextEvents {

    constructor() {
        super();
        this.register(Configuration, ConfigurationEvents);
        this.register(LoginSession, LoginSessionEvents);
        this.register(Tag, TagEvents);
        this.register(User, UserEvents);
    }

}