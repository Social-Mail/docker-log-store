import ClusterInstance, { RecycledWorker } from "@entity-access/server-pages/dist/ClusterInstance.js";
import sleep from "@entity-access/server-pages/dist/sleep.js";
import WebServer from "./WebServer.js";
import { globalEnv } from "./globalEnv.js";

const numCPUs = globalEnv.numCPUs;

export default class WebCluster extends ClusterInstance<typeof WebServer> {

    public static start(arg: typeof WebServer = WebServer) {
        const cluster = new WebCluster();
        cluster.run(arg);
    }

    protected async runPrimary(arg: typeof WebServer) {

        // seed...
        const ws = new arg();
        await ws.create(true, false);

        while(true) {
            const workers = [] as RecycledWorker[];
            console.log(`Creating cluster ${numCPUs} workers`);
            for (let index = 0; index < numCPUs; index++) {
                workers.push(this.fork({ port: 8081 }));
            }

            // sleep for 30 days
            for (let index = 0; index < 30; index++) {
                await sleep(24*60*60*1000);
            }

            for (const worker of workers) {
                worker.destroy();
            }
        }
    }

    protected async runWorker(arg: typeof WebServer) {
        console.log(`Worker started`);
        const ws = new arg();
        await ws.create();
    }

}