﻿using DotnetAuth.Domain.Contracts;
using DotnetAuth.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace DotnetAuth.Service
{
    /// <summary>
    /// Implementation of the ITokenService interface for generating JWT tokens and refresh tokens.
    /// </summary>
    public class ToekenServiceImple : ITokenService
    {
        private readonly SymmetricSecurityKey _secretKey;
        private readonly string? _validIssuer;
        private readonly string? _validAudience;
        private readonly double _expires;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<ToekenServiceImple> _logger;
        private readonly ITokenBlacklistService _tokenBlacklistService;

        /// <summary>
        /// Initializes a new instance of the <see cref="ToekenServiceImple"/> class.
        /// </summary>
        /// <param name="configuration">The configuration settings.</param>
        /// <param name="userManager">The user manager for managing user information.</param>
        /// <param name="logger">The logger for logging information.</param>
        /// <param name="tokenBlacklistService">The token blacklist service for managing token revocation.</param>
        /// <exception cref="InvalidOperationException">Thrown when JWT secret key is not configured.</exception>
        public ToekenServiceImple(
            IConfiguration configuration, 
            UserManager<ApplicationUser> userManager, 
            ILogger<ToekenServiceImple> logger,
            ITokenBlacklistService tokenBlacklistService)
        {
            _userManager = userManager;
            _logger = logger;
            _tokenBlacklistService = tokenBlacklistService;
            
            var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>();
            if (jwtSettings == null || string.IsNullOrEmpty(jwtSettings.Key))
            {
                throw new InvalidOperationException("JWT secret key is not configured.");
            }

            _secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));
            _validIssuer = jwtSettings.ValidIssuer;
            _validAudience = jwtSettings.ValidAudience;
            _expires = jwtSettings.Expires;
        }

        /// <summary>
        /// Generates a JWT token for the specified user.
        /// </summary>
        /// <param name="user">The user for whom the token is generated.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the generated JWT token.</returns>
        public async Task<string> GenerateToken(ApplicationUser user)
        {
            var signingCredentials = new SigningCredentials(_secretKey, SecurityAlgorithms.HmacSha256);
            var claims = await GetClaimsAsync(user);
            var tokenOptions = GenerateTokenOptions(signingCredentials, claims);
            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

        /// <summary>
        /// Gets the claims for the specified user.
        /// </summary>
        /// <param name="user">The user for whom the claims are retrieved.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the list of claims.</returns>
        private async Task<List<Claim>> GetClaimsAsync(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user?.UserName ?? string.Empty),
                new Claim(ClaimTypes.NameIdentifier, user?.Id ?? string.Empty),
                new Claim(ClaimTypes.Email, user?.Email ?? string.Empty),
                new Claim("FirstName", user?.FirstName ?? string.Empty),
                new Claim("LastName", user?.LastName ?? string.Empty),
                new Claim("FullName", user?.FullName ?? string.Empty),
                new Claim("Gender", user?.Gender.ToString() ?? string.Empty),
                new Claim("Role", user?.Role ?? string.Empty),
            };

            var roles = await _userManager.GetRolesAsync(user);
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            return claims;
        }

        /// <summary>
        /// Generates the token options for the JWT token.
        /// </summary>
        /// <param name="signingCredentials">The signing credentials for the token.</param>
        /// <param name="claims">The claims to be included in the token.</param>
        /// <returns>The generated JWT token options.</returns>
        private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
        {
            return new JwtSecurityToken(
                issuer: _validIssuer,
                audience: _validAudience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(_expires),
                signingCredentials: signingCredentials
            );
        }

        /// <summary>
        /// Generates a refresh token.
        /// </summary>
        /// <returns>The generated refresh token.</returns>
        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        /// <summary>
        /// Revokes a token by adding it to the blacklist.
        /// </summary>
        /// <param name="token">The token to be revoked.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task RevokeTokenAsync(string token)
        {
            try
            {
                var expiryTime = await GetTokenExpiryTimeAsync(token);
                await _tokenBlacklistService.BlacklistTokenAsync(token, expiryTime);
                _logger.LogInformation("Token revoked successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking token");
                throw;
            }
        }

        /// <summary>
        /// Gets the expiry time of a JWT token.
        /// </summary>
        /// <param name="token">The token for which the expiry time is retrieved.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the expiry time of the token.</returns>
        public async Task<DateTime> GetTokenExpiryTimeAsync(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            return jwtToken.ValidTo;
        }
    }
}
