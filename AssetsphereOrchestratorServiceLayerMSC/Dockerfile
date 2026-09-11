# ==============================================================================
# STAGE 1: Build & Publish
# ==============================================================================
# We use the full .NET 10 SDK image to restore dependencies and compile the code.
# Pinned by digest (not the floating "10.0-preview" tag): while .NET 10 is in preview,
# Microsoft republishes that tag to newer preview builds over time, so the SDK used to
# build and the aspnet runtime below (also pinned) can silently drift out of sync and
# produce assembly version mismatches at startup (eg. TypeLoadException on internal
# ASP.NET Core types). Pinning both stages to the exact same matched digest prevents that.
FROM mcr.microsoft.com/dotnet/sdk@sha256:1d5e6f2c1ece7d5826bafc8a7f2d54db2c6478a0f2bd1c995d05a37c0be4783e AS build
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
# Pinned by digest to match the SDK image above - see comment there.
FROM mcr.microsoft.com/dotnet/aspnet@sha256:ed557d471a2b702b72fd1fd4835040bbbdfbd2532ae78cfc90546773d88a91d7 AS final
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
