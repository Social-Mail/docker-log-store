using Docker.DotNet;
using Docker.DotNet.Models;
using RetroCoreFit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DockerLogStoreAgent;

internal class PushClient
{
    public readonly HttpClient HttpClient;
    private readonly string? host;
    private string? serverID;

    public PushClient()
    {
        HttpClient = new HttpClient();
        this.host = System.Environment.GetEnvironmentVariable("LOG_STORE_HOST");
        if (string.IsNullOrEmpty(host) )
        {
            throw new ArgumentException("LOG_STORE_HOST environment variable must be defined");
        }
        this.serverID = System.Environment.GetEnvironmentVariable("LOG_STORE_SERVER_ID");
    }

    internal void SetServerID(string name)
    {
        if (string.IsNullOrEmpty(serverID))
        {
            this.serverID = name;
        }
        HttpClient.BaseAddress = new Uri($"https://{host}/api/push/${this.serverID}/");
    }
}
