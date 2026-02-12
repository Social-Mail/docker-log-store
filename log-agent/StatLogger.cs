using Docker.DotNet;
using Docker.DotNet.Models;
using RetroCoreFit;

namespace DockerLogStoreAgent;

internal class StatLogger
{
    private readonly PushClient client;
    private readonly ContainerLogger containerLogger;

    public StatLogger(PushClient client, ContainerLogger containerLogger)
    {
        this.client = client;
        this.containerLogger = containerLogger;
    }

    internal async Task ReportContainerStatsAsync(SystemInfoResponse systemInfo, DockerClient client, CancellationToken stoppingToken)
    {
        // report ping
        var list = await client.Containers
            .ListContainersAsync(new Docker.DotNet.Models.ContainersListParameters
            {
                All = true,
                Size = true
            }, stoppingToken);

        foreach (var container in list)
        {

            containerLogger.StartLogging(client, container.ID, container.State, container.Names);

            if (container.State == "running")
            {
                // get all processes...
                var processList = await client.Containers.ListProcessesAsync(container.ID, new ContainerListProcessesParameters
                {

                }, stoppingToken);

                var time = DateTime.UtcNow;

                try
                {

                    await RequestBuilder.Put("stats/" + container.ID)
                        .Body(new
                        {
                            id = container.ID,
                            names = container.Names,
                            state = container.State,
                            status = container.Status,
                            command = container.Command,
                            image = container.Image,
                            imageID = container.ImageID,
                            sizeRootFs = container.SizeRootFs,
                            sizeRw = container.SizeRw,
                            totalMemory = systemInfo.MemTotal,
                            cpu = systemInfo.NCPU,
                            time,
                            ports = container.Ports.Select((p) => new
                            {
                                @private = p.PrivatePort,
                                @public = p.PublicPort,
                                ip = p.IP,
                                type = p.Type,
                            }),
                            processes = processList.Processes
                        })
                        .GetResponseAsync(this.client.HttpClient);
                } catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                }

                continue;
            }
            try
            {
                var time = DateTime.UtcNow;
                await RequestBuilder.Put("stats")
                    .Body(new
                    {
                        id = container.ID,
                        names = container.Names,
                        state = container.State,
                        status = container.Status,
                        command = container.Command,
                        image = container.Image,
                        imageID = container.ImageID,
                        sizeRootFs = container.SizeRootFs,
                        sizeRw = container.SizeRw,
                        totalMemory = systemInfo.MemTotal,
                        cpu = systemInfo.NCPU,
                        time,
                        ports = container.Ports.Select((p) => new
                        {
                            @private = p.PrivatePort,
                            @public = p.PublicPort,
                            ip = p.IP,
                            type = p.Type,
                        }),
                    })
                    .GetResponseAsync(this.client.HttpClient);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex);
            }
        }

    }

}
