using System.Diagnostics.CodeAnalysis;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.HealthCheck.Assertion;

public sealed class HealthCheckAssertion
{
    private static readonly HealthCheckAssertion _current = new HealthCheckAssertion();
    public static HealthCheckAssertion Current => _current;

    private HealthCheckAssertion()
    {
    }

    public void CheckForNullRequest<T>([NotNull] T? request, string errorMessage = "Request cannot be null.")
    {
        if (request is null)
        {
            throw new ValidationCException(errorMessage);
        }
    }
}
