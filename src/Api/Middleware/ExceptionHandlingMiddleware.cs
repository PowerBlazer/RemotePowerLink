﻿using System.Net;
using System.Text.Json;
using Domain.Common;
using Domain.Exceptions;
using ValidationException = Domain.Exceptions.ValidationException;

namespace Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, 
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (ValidationException ex)
        {
            await HandleExceptionAsync(httpContext, HttpStatusCode.BadRequest, ex.Errors);
        }
        catch (ConnectionServerException ex)
        {
            await HandleExceptionAsync(httpContext, HttpStatusCode.BadRequest, ex.Errors);
        }
        catch (NotFoundException ex)
        {
            await HandleExceptionAsync(httpContext,HttpStatusCode.NotFound,ex.Errors);
        }
        catch (AuthenticationValidException ex)
        {
            await HandleExceptionAsync(httpContext,HttpStatusCode.Unauthorized,ex.Errors);
        }
        catch (SessionCodeNotFoundException ex)
        {
            await HandleExceptionAsync(httpContext,HttpStatusCode.NotFound,ex.Errors);
        }
        catch (SessionCodeNotValidException ex)
        {
            await HandleExceptionAsync(httpContext,HttpStatusCode.BadRequest,ex.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            
            await HandleExceptionAsync(httpContext,HttpStatusCode.InternalServerError, "Ошибка на сервере");
        }
    }
        
    private static Task HandleExceptionAsync(HttpContext httpContext,
        HttpStatusCode httpStatusCode, Dictionary<string, List<string>>? errors)
    {
        var response = httpContext.Response;

        response.ContentType = "application/json";
        response.StatusCode = (int)httpStatusCode;

        var errorResult = new ApiActionResult<string>
        {
            Errors = errors
        };

        var result = JsonSerializer.Serialize(errorResult);

        return response.WriteAsync(result);
    }
    
    private static Task HandleExceptionAsync(HttpContext httpContext,
        HttpStatusCode httpStatusCode, string error)
    {
        var response = httpContext.Response;

        response.ContentType = "application/json";
        response.StatusCode = (int)httpStatusCode;

        var errorResult = new
        {
            Error = error
        };
        
        var result = JsonSerializer.Serialize(errorResult);

        return response.WriteAsync(result);
    }
    
    

    
    
}