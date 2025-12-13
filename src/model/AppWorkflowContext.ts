import Inject, { RegisterSingleton } from "@entity-access/entity-access/dist/di/di.js";
import WorkflowContext, { IWorkflowStartParams } from "@entity-access/entity-access/dist/workflows/WorkflowContext.js";
import WorkflowStorage from "@entity-access/entity-access/dist/workflows/WorkflowStorage.js";
import DailyWorkflow from "../workflows/daily/DailyWorkflow.js";
import DateTime from "@entity-access/entity-access/dist/types/DateTime.js";
import sleep from "@entity-access/server-pages/dist/sleep.js";

@RegisterSingleton
export default class AppWorkflowContext extends WorkflowContext {
    constructor(@Inject storage: WorkflowStorage) {
        super(storage);

        this.register(DailyWorkflow);
        
    }

    start({ taskGroups,  signal }: IWorkflowStartParams ) {
        this.startDailyWorkflows(signal).catch(console.error);
        return super.start({ taskGroups, signal });
    }

    async startDailyWorkflows(signal: AbortSignal) {

        // we will wait for couple of seconds
        await sleep(5000);

        while(!signal?.aborted) {

            // start all daily workflows...
            const now = DateTime.now.date.msSinceEpoch;
            const id = `daily-${now}`;
            await this.queue(DailyWorkflow, 1, { id, taskGroup: "daily" });

            await sleep(86400);
        }
    }
}