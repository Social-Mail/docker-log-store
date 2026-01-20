using Docker.DotNet;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using RetroCoreFit;
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

    internal void StartLogging(DockerClient client, string id, string state, IList<string> names)
    {
        // Task.Run(() => this.StartLoggingAsync(client, id, state));
        var key = $"logger-task-{id}";
        Task.Run(() => cache.GetOrCreateAsync(key, async (k) =>
        {
            try
            {
                k.SlidingExpiration = TimeSpan.FromHours(1);
                await StartLoggingAsync(k, client, id, state, names);
                cache.Remove(k.Key);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
            }
            return 1;
        }));
    }

    private async Task<string> StartLoggingAsync(ICacheEntry k, DockerClient client, string id, string state, IList<string> names)
    {

        try
        {

            using var stream = await client.Containers.GetContainerLogsAsync(id, false, new Docker.DotNet.Models.ContainerLogsParameters { Follow = true });

            var buffer = new byte[16 * 1024];

            while(true)
            {
                var r = await stream.ReadOutputAsync(buffer, 0, buffer.Length, CancellationToken.None);
                var len = r.Count;
                await RequestBuilder
                    .Put($"log/{id}/{r.Target.ToString()}")
                    .Body(new {
                        names,
                        data = Convert.ToBase64String(buffer, 0, len, Base64FormattingOptions.None),
                        eof = r.EOF
                    }).GetResponseAsync(this.client.HttpClient);
            }
            
        }
        catch (Exception ex)
        {
        }
        return "done";
    }
}
