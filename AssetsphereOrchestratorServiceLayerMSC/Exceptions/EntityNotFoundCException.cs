namespace AssetsphereOrchestratorServiceLayerMSC.Exceptions;

public sealed class EntityNotFoundCException : Exception
{
    public string EntityName { get; }
    public object EntityId { get; }

    public EntityNotFoundCException(string entityName, object entityId)
        : base($"Entity '{entityName}' with identifier '{entityId}' was not found.")
    {
        EntityName = entityName;
        EntityId = entityId;
    }
}
