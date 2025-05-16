namespace DotnetAuth.Domain.Contracts
{
    public enum UserRole
    {
        Admin,
        Doctor,
        Patient
    }

    public enum Gender
    {
        Male,
        Female
    }

    public class UserRegisterRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Gender Gender { get; set; }
        public UserRole Role { get; set; }

        public bool IsValidRegistrationRole()
        {
            return Role == UserRole.Doctor || Role == UserRole.Patient;
        }
    }

    public class UserRegisterResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Otp { get; set; }
        public string UserId { get; set; }
    }

    public class VerifyOtpRequest
    {
        public string Email { get; set; }
        public string Otp { get; set; }
    }

    public class VerifyOtpResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string AccessToken { get; set; }
        public string UserId { get; set; }
    }

    public class UserResponse
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string Role { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime UpdateAt { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }

    public class UserLoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }

    public class CurrentUserResponse
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string Role { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime UpdateAt { get; set; }
        public string? AccessToken { get; set; }
    }

    public class UpdateUserRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Gender Gender { get; set; }
    }

    public class RevokeRefreshTokenResponse
    {
        public string Message { get; set; }
    }

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; }
    }


    public class Setup2faRequest
    {
        public string TwoFactorType { get; set; }
    }

    public class Setup2faResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Secret { get; set; }
        public string QrCodeUrl { get; set; }
        public string VerificationCode { get; set; }
    }

    public class Verify2faSetupRequest
    {
        public string VerificationCode { get; set; }
    }

    public class Verify2faSetupResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<string> RecoveryCodes { get; set; }
    }

    public class Disable2faRequest
    {
        public string Password { get; set; }
    }

    public class Disable2faResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class TwoFactorLoginRequest
    {
        public string Email { get; set; }
        public string TwoFactorCode { get; set; }
        public bool RememberDevice { get; set; }
    }

    public class TwoFactorLoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public bool RequiresTwoFactor { get; set; }
        public string TwoFactorType { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string UserId { get; set; }
        public string Email { get; set; }
    }
}