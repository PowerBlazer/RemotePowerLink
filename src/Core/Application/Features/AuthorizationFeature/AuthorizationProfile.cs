using Application.Features.AuthorizationFeature.LoginUser;
using Application.Features.AuthorizationFeature.RefreshToken;
using Application.Features.AuthorizationFeature.RegisterUser;
using AutoMapper;
using Domain.DTOs.Authorization;

namespace Application.Features.AuthorizationFeature;

public class AuthorizationProfile: Profile
{
    public AuthorizationProfile()
    {
        CreateMap<RegistrationRequest,RegisterUserCommand>()
            .ReverseMap();
        CreateMap<LoginRequest, LoginUserCommand>()
            .ReverseMap();
        CreateMap<RefreshTokenRequest, RefreshTokenCommand>()
            .ReverseMap();
    }
}