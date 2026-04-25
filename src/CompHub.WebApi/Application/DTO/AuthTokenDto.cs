namespace CompHub.WebApi.Application.DTO
{
    public record AuthTokenDto(
        string AccessToken,
        DateTime ExpiresAt,
        int UserId,
        string Email,
        string FirstName,
        string LastName
    );
}
