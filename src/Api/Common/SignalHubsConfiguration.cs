﻿using Application.Hubs;

namespace Api.Common;

public static class SignalHubsConfiguration
{
    public static void UseSignalRHubs(this WebApplication app)
    {
        app.MapHub<SftpHub>("/sftp");
        app.MapHub<NotificationHub>("/notification");
        app.MapHub<TerminalHub>("/terminal");
    }
}