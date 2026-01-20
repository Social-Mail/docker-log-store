import { RegisterSingleton } from "@entity-access/entity-access/dist/di/di.js";
import SocketNamespace, { Send, SocketNamespaceClient } from "@entity-access/server-pages/dist/socket/SocketNamespace.js";

@RegisterSingleton
export default class LiveTraceNamespace extends SocketNamespace {

    get clientClass() {
        return SocketNamespaceClient;
    }

    @Send
    send(...trace: any[]) {
        // do nothing...
    }

}