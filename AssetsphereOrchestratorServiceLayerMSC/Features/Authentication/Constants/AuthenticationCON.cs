namespace AssetsphereOrchestratorServiceLayerMSC.Features.Authentication.Constants;

public static class AuthenticationCON
{
    public const string DefaultDomain = "assetsphere.internal";
    public const string InvalidCredentialsError = "Invalid email or password combination provided.";
    public const string UserAlreadyExistsError = "An account with this email address already exists.";
    public const string UserNotFoundError = "User account not found.";
    public const string InvalidTokenError = "Invalid or expired refresh token.";
}
