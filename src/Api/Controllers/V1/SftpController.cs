using System.IO.Compression;
using Application.Features.SftpFeature.CreateDirectory;
using Application.Features.SftpFeature.DeleteFoldersOrFiles;
using Application.Features.SftpFeature.DownloadFoldersOrFiles;
using Application.Features.SftpFeature.GetSizeFoldersOrFiles;
using Application.Features.SftpFeature.RenameFolderOrFile;
using Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1;

[Authorize]
[ApiController]
[Route("api/v{version:apiVersion}/sftp")]
[ApiVersion("1.0")]
public class SftpController: BaseController
{
    private readonly IWebHostEnvironment _webHostEnvironment;
    public SftpController(IMediator mediator, 
        IWebHostEnvironment webHostEnvironment) : base(mediator)
    {
        _webHostEnvironment = webHostEnvironment;
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
        [FromBody]DownloadFoldersOrFilesCommand downloadFoldersOrFilesCommand)
    {
        downloadFoldersOrFilesCommand.UserId = UserId;
        downloadFoldersOrFilesCommand.TempPath =
            Path.Combine(_webHostEnvironment.WebRootPath, "Temp", Guid.NewGuid().ToString());

        var downloadedFilesPath = await Mediator.Send(downloadFoldersOrFilesCommand);
        var zipFilePath = Path.Combine(_webHostEnvironment.WebRootPath, "Temp", $"downloaded_files_{UserId}.zip");
        
        if(System.IO.File.Exists(zipFilePath))
            System.IO.File.Delete(zipFilePath);
        
        ZipFile.CreateFromDirectory(downloadedFilesPath, zipFilePath);

        if (Directory.Exists(downloadedFilesPath))
            Directory.Delete(downloadedFilesPath,true);
        
        return PhysicalFile(zipFilePath, "application/zip", enableRangeProcessing: true);
    }
    
}