using Application.Features.AuthorizationFeature.LoginUser;
using Application.Features.AuthorizationFeature.RefreshToken;
using Application.Features.AuthorizationFeature.RegisterUser;
using Application.Layers.Identity.Models;
using Application.Layers.Identity.Models.Authorization;
using AutoMapper;

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