using System.IO.Compression;
using Application.Features.SftpFeature.CreateDirectory;
using Application.Features.SftpFeature.DeleteFoldersOrFiles;
using Application.Features.SftpFeature.DownloadFoldersOrFiles;
using Application.Features.SftpFeature.GetSizeFoldersOrFiles;
using Application.Features.SftpFeature.RenameFolderOrFile;
using Application.Hubs;
using Domain.Common;
using Domain.DTOs.Notification;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/sftp")]
[ApiVersion("1.0")]
public class SftpController: BaseController
{
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly IHubContext<SftpHub> _sftpHubContext;
    public SftpController(IMediator mediator, 
        IWebHostEnvironment webHostEnvironment, 
        IHubContext<SftpHub> sftpHubContext) : base(mediator)
    {
        _webHostEnvironment = webHostEnvironment;
        _sftpHubContext = sftpHubContext;
    }

    /// <summary>
    /// Создает новую директорию на удаленном сервере
    /// </summary>
    /// <param name="createDirectoryCommand"></param>
    /// <response code="200">Директория успешно создана.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="403">Доступ запрещен</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [HttpPost("create-directory")]
    public async Task<ApiActionResult> CreateDirectory(
        [FromBody]CreateDirectoryCommand createDirectoryCommand)
    {
        createDirectoryCommand.UserId = UserId;
        await Mediator.Send(createDirectoryCommand);

        return new ApiActionResult();
    }
    
    /// <summary>
    /// Перименовавывает директорию или файл на удаленном сервере
    /// </summary>
    /// <param name="renameFolderOrFileCommand"></param>
    /// <response code="200">Директория успешно создана.</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="403">Доступ запрещен</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [HttpPost("rename")]
    public async Task<ApiActionResult> RenameFolderOrFile(
        [FromBody]RenameFolderOrFileCommand renameFolderOrFileCommand)
    {
        renameFolderOrFileCommand.UserId = UserId;
        await Mediator.Send(renameFolderOrFileCommand);

        return new ApiActionResult();
    }
    
    /// <summary>
    /// Удаляет переданные файлы или папки по SSH
    /// </summary>
    /// <param name="deleteFoldersOrFilesCommand"></param>
    /// <response code="200">Файлы или папки успешно удалены</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="403">Доступ запрещен</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [HttpPost("delete")]
    public async Task<ApiActionResult> DeleteFilesOrFolders(
        [FromBody]DeleteFoldersOrFilesCommand deleteFoldersOrFilesCommand)
    {
        deleteFoldersOrFilesCommand.UserId = UserId;
        await Mediator.Send(deleteFoldersOrFilesCommand);

        return new ApiActionResult();
    }

    /// <summary>
    /// Получить размер файлов и папок по SSH
    /// </summary>
    /// <param name="getSizeFoldersOrFilesCommand"></param>
    /// <response code="200">Размер успешно получен</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="403">Доступ запрещен</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [HttpPost("size")]
    public async Task<ApiActionResult<ulong>> GetSizeFoldersOrFiles(
        [FromBody]GetSizeFoldersOrFilesCommand getSizeFoldersOrFilesCommand)
    {
        getSizeFoldersOrFilesCommand.UserId = UserId;
        
        var result = await Mediator.Send(getSizeFoldersOrFilesCommand);

        return new ApiActionResult<ulong>
        {
            Result = result
        };
    }

    /// <summary>
    /// Скачивает файлы или папки по SFTP
    /// </summary>
    /// <param name="downloadFoldersOrFilesCommand"></param>
    /// <param name="cancellationToken"></param>
    /// <response code="200">Файлы или папки успешно скачаны</response>
    /// <response code="400">Ошибка валидации данных.</response>
    /// <response code="403">Доступ запрещен</response>
    /// <response code="401">Пользователь не авторизован.</response>
    /// <response code="500">Ошибка на сервере.</response>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [HttpPost("download")]
    public async Task<IActionResult> DownloadFoldersOrFiles(
        [FromBody]DownloadFoldersOrFilesCommand downloadFoldersOrFilesCommand,
        CancellationToken cancellationToken)
    {
        downloadFoldersOrFilesCommand.UserId = UserId;
        downloadFoldersOrFilesCommand.TempPath =
            Path.Combine(_webHostEnvironment.WebRootPath, "Temp");

        var downloadFolderOrFilesResponse = await Mediator.Send(downloadFoldersOrFilesCommand,cancellationToken);
        var zipFileName = $"{downloadFoldersOrFilesCommand.FilesOrFoldersToDownloadList.First().Name}";
        var zipFilePath = Path.Combine(
            _webHostEnvironment.WebRootPath, 
            "Temp",
            "ZipFiles",
            $"{zipFileName}_{Guid.NewGuid().ToString()[..10]}.zip");
        
        if(System.IO.File.Exists(zipFilePath))
            System.IO.File.Delete(zipFilePath);

        await _sftpHubContext.Clients
            .Client(downloadFoldersOrFilesCommand.ConnectionId)
            .SendAsync(
                "downloadReceive",
                new DownloadNotification
                {
                    OperationName = "Сжатие файлов",
                    IsProgress = false
                }, cancellationToken: cancellationToken);
        
        ZipFile.CreateFromDirectory(downloadFolderOrFilesResponse.FolderTempPath, zipFilePath);

        if (Directory.Exists(downloadFolderOrFilesResponse.FolderTempPath))
            Directory.Delete(downloadFolderOrFilesResponse.FolderTempPath,true);

        if (downloadFolderOrFilesResponse.Errors?.Count > 0)
        {
            await _sftpHubContext.Clients
                .Client(downloadFoldersOrFilesCommand.ConnectionId)
                .SendAsync(
                    "HandleError", 
                    downloadFolderOrFilesResponse.Errors, 
                    cancellationToken: cancellationToken);
        }
        
        await _sftpHubContext.Clients
            .Client(downloadFoldersOrFilesCommand.ConnectionId)
            .SendAsync(
                "downloadReceive",
                new DownloadNotification
                {
                    OperationName = "Отправка файлов",
                    IsProgress = false,
                }, cancellationToken: cancellationToken);
        
        Response.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition");
        
        return PhysicalFile(zipFilePath, "application/zip", enableRangeProcessing: true, fileDownloadName:zipFileName);
    }
    
}