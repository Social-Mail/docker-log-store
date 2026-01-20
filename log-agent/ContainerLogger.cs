using Docker.DotNet;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DockerLogStoreAgent;

internal class ContainerLogger
{
    private readonly PushClient client;
    private readonly IMemoryCache cache;
    private readonly ILogger<DockerListener> logger;

    public ContainerLogger(PushClient client, IMemoryCache cache, ILogger<DockerListener> logger)
    {
        this.client = client;
        this.cache = cache;
        this.logger = logger;
    }

    internal void StartLogging(DockerClient client, string id, string state)
    {
        // Task.Run(() => this.StartLoggingAsync(client, id, state));
        var key = $"logger-task-{id}";
        Task.Run(() => cache.GetOrCreateAsync(key, async (k) =>
        {
            try
            {
                k.SlidingExpiration = TimeSpan.FromHours(1);
                await StartLoggingAsync(client, id, state);
                cache.Remove(k.Key);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
            }
            return 1;
        }));
    }

    private async Task<string> StartLoggingAsync(DockerClient client, string id, string state)
    {
        try
        {

        }
        catch (Exception ex)
        {
        }
    }
}
