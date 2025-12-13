import { RegisterScoped } from "@entity-access/entity-access/dist/di/di.js";
import EntityContext from "@entity-access/entity-access/dist/model/EntityContext.js";
import { User } from "./entities/User.js";
import LoginSession from "./entities/LoginSession.js";
import Configuration from "./entities/Configuration.js";
import Tag from "./entities/Tag.js";
import Trace from "./entities/Trace.js";
import TraceSource from "./entities/TraceSource.js";

@RegisterScoped
export default class AppDbContext extends EntityContext {

    public configurations = this.model.register(Configuration);

    public loginSessions = this.model.register(LoginSession);

    public tags = this.model.register(Tag);

    public traces = this.model.register(Trace);

    public traceSources = this.model.register(TraceSource);

    public users = this.model.register(User);

}