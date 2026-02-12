using System;
using System.Collections.Generic;
using System.Text;

namespace DockerLogStoreAgent;

internal static class RetryTask
{

    public static void Retry(Func<Task> task)
    {
        Task.Run(async () => {

            for (int i = 0; i < 3; i++)
            {
                try
                {
                    await task();
                    return;
                }
                catch (Exception e)
                {
                    System.Diagnostics.Debug.WriteLine(e);
                    await Task.Delay(500);
                }
            }

        });
    }

}
