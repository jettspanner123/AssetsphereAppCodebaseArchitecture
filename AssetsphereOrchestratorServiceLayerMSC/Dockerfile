# ==============================================================================
# STAGE 1: Build & Publish
# ==============================================================================
# We use the full .NET 10 SDK image to restore dependencies and compile the code.
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
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
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app

# Configure default ports for container environments like Render (10000)
ENV ASPNETCORE_HTTP_PORTS=10000
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Copy the published binary artifacts from Stage 1 into this clean runtime image
COPY --from=build /app/publish .

# Define the command to run the backend Web API server
ENTRYPOINT ["dotnet", "AssetsphereOrchestratorServiceLayerMSC.dll"]
