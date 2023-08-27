FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 6001


FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["RemorePowerLink/RemorePowerLink.csproj", "RemorePowerLink/"]
RUN dotnet restore "RemotePowerLink/RemotePowerLink.csproj"
COPY . .
WORKDIR "/src/RemorePowerLink"
RUN dotnet build "RemotePowerLink.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RemotePowerLink.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RemorePowerLink.dll"]
