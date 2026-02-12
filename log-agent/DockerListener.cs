using Docker.DotNet;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Diagnostics.SymbolStore;

namespace DockerLogStoreAgent;

internal class DockerListener : BackgroundService
{
    private readonly ILogger<DockerListener> logger;
    private readonly PushClient pushClient;
    private readonly StatLogger statLogger;

    public DockerListener(ILogger<DockerListener> logger, PushClient pushClient, StatLogger statLogger)
    {
        this.logger = logger;
        this.pushClient = pushClient;
        this.statLogger = statLogger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                DockerClient client = new DockerClientConfiguration(
                   new Uri("unix:///var/run/docker.sock"))
                  .CreateClient();

                // since we may be inside a container
                // we should get system info from the docker host

                var systemInfo = await client.System.GetSystemInfoAsync();

                pushClient.SetServerID(systemInfo.Name);

                while (!stoppingToken.IsCancellationRequested)
                {

                    try
                    {
                        await statLogger.ReportContainerStatsAsync(systemInfo, client, stoppingToken);
                    } catch (Exception ex)
                    {
                        this.logger.LogError(ex, ex.Message);
                    }

                    // start logging
                    await Task.Delay(5000);
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, ex.Message);
                await Task.Delay(15000);
            }
        }
    }
}
