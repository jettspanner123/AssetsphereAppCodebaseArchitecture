using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Utilities;
using Microsoft.IdentityModel.Tokens;

namespace AssetsphereOrchestratorServiceLayerMSC.Helpers;

public sealed class JwtTokenHelper
{
    private static readonly JwtTokenHelper _current = new JwtTokenHelper();
    public static JwtTokenHelper Current => _current;

    private JwtTokenHelper()
    {
    }

    public string GenerateAccessToken(UserEntityClass user)
    {
        string secretKey = ENValidator.Current.GetValueOrDefault("ASSETSPHERE_JWT_SECRET", "AssetsphereSuperSecretKey2026SecureLongJwtTokenSigningKey!");
        string issuer = ENValidator.Current.GetValueOrDefault("ASSETSPHERE_JWT_ISSUER", "AssetsphereOrchestrator");
        string audience = ENValidator.Current.GetValueOrDefault("ASSETSPHERE_JWT_AUDIENCE", "AssetsphereClient");
        int expiryMinutes = ENValidator.Current.GetIntValue("ASSETSPHERE_JWT_EXPIRY_MINUTES", 1440);

        byte[] keyBytes = Encoding.UTF8.GetBytes(secretKey);
        SymmetricSecurityKey signingKey = new SymmetricSecurityKey(keyBytes);
        SigningCredentials credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("role", user.Role.ToString()),
            new Claim("Department", user.Department?.ToString() ?? ""),
            new Claim("AvatarUrl", user.AvatarUrl ?? "")
        };

        JwtSecurityToken token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        byte[] randomBytes = new byte[64];
        using System.Security.Cryptography.RandomNumberGenerator rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}
