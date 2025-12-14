using Docker.DotNet;
using Docker.DotNet.Models;
using System.ComponentModel;

namespace DockerLogStoreAgent;

internal class Program
{
    static void Main(string[] args)
    {
        Task.Run(async () =>
        {
            try
            {
                await MainAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        });
    }

    static async Task MainAsync()
    {

        DockerClient client = new DockerClientConfiguration(
             new Uri("unix:///var/run/docker.sock"))
            .CreateClient();


        // ping...
        while (true)
        {

            var systemInfo = await client.System.GetSystemInfoAsync();

            var totalCPU = systemInfo.NCPU;
            var totalMemory = systemInfo.MemTotal;

            var containers = await client.Containers.ListContainersAsync(new Docker.DotNet.Models.ContainersListParameters { All = true });

            foreach (var container in containers) {
                // watch logs...
                Task.Run(() => WatchLogs(client, container));
            }

            await Task.Delay(1000);
        }

    }

    private static void WatchLogs(DockerClient client, ContainerListResponse container)
    {
        container.
    }
}
