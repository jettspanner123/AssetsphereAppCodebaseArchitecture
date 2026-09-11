# ==============================================================================
# STAGE 1: Build & Publish
# ==============================================================================
# We use the full .NET 10 SDK image to restore dependencies and compile the code.
# .NET 10 has been GA for a while (the NuGet packages below are on the stable 10.0.11
# servicing line), but this Dockerfile was still building against the "10.0-preview"
# tag, which Microsoft stopped updating once GA shipped - it stayed frozen on an old
# preview build (10.0.0-preview.7) whose ASP.NET Core API surface doesn't line up with
# the stable packages, causing a TypeLoadException at startup. Using the stable "10.0"
# tag (not "-preview") fixes that; GA servicing releases keep strict API/ABI
# compatibility across patches, so SDK/runtime patch-version skew is no longer a risk.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy only the project file first to take advantage of Docker layer caching
COPY AssetsphereOrchestratorServiceLayerMSC.csproj ./
RUN dotnet restore AssetsphereOrchestratorServiceLayerMSC.csproj

# Copy the rest of the backend source code and build Release binaries
COPY . ./
RUN dotnet publish AssetsphereOrchestratorServiceLayerMSC.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

# ==============================================================================
# STAGE 2: Lightweight Production Runtime
# ==============================================================================
# We switch to the lightweight ASP.NET Core runtime image (no compiler or SDK overhead)
# Stable "10.0" tag - see comment on the build stage above.
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# The slim runtime image doesn't ship libgssapi-krb5-2, which .NET's networking stack
# (Npgsql's TLS negotiation to Postgres) needs at runtime - without it the container
# crashes on startup with "libgssapi_krb5.so.2: cannot open shared object file".
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgssapi-krb5-2 \
    && rm -rf /var/lib/apt/lists/*

# Configure default ports for container environments like Render (10000)
ENV ASPNETCORE_HTTP_PORTS=10000
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Copy the published binary artifacts from Stage 1 into this clean runtime image
COPY --from=build /app/publish .

# Define the command to run the backend Web API server
ENTRYPOINT ["dotnet", "AssetsphereOrchestratorServiceLayerMSC.dll"]
