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

                await RequestBuilder.Put("stats")
                    .Body(new
                    {
                        time = DateTime.UtcNow,
                        id = container.ID,
                        names = container.Names,
                        state = container.State,
                        status = container.Status,
                        command = container.Command,
                        image = container.Image,
                        imageID = container.ImageID,
                        sizeRootFs = container.SizeRootFs,
                        sizeRw = container.SizeRw,
                        ports = container.Ports.Select((p) => new {
                            @private = p.PrivatePort,
                            @public = p.PublicPort,
                            ip = p.IP,
                            type = p.Type,
                        }),
                        processes = processList.Processes
                    })
                    .GetResponseAsync(this.client.HttpClient);

                continue;
            }
            await RequestBuilder.Put("stats")
                .Body(new
                {
                    time = DateTime.UtcNow,
                    id = container.ID,
                    names = container.Names,
                    state = container.State,
                    status = container.Status,
                    command = container.Command,
                    image = container.Image,
                    imageID = container.ImageID,
                    sizeRootFs = container.SizeRootFs,
                    sizeRw = container.SizeRw,
                    ports = container.Ports.Select((p) => new {
                        @private = p.PrivatePort,
                        @public = p.PublicPort,
                        ip = p.IP,
                        type = p.Type,
                    }),
                })
                .GetResponseAsync(this.client.HttpClient);
        }

    }

}
