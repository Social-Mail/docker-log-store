using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


namespace DockerLogStoreAgent;

internal class Program
{
    static void Main(string[] args)
    {
        var builder = Host.CreateDefaultBuilder(args); // or HostApplicationBuilder.Create(args); in newer versions

        builder.ConfigureServices((hostContext, services) =>
        {
            services.AddMemoryCache();

            // Register your services here
            services.AddHostedService<DockerListener>();
            services.AddSingleton<PushClient>();
            services.AddSingleton<ContainerLogger>();
            services.AddSingleton<StatLogger>();

        });

        var host = builder.Build();

        // Run your application logic
        host.Run();
    }

}
