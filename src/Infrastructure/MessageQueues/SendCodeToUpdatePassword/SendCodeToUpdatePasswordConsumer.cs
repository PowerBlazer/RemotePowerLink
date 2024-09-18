using Application.Layers.Email;
using Application.Layers.MessageQueues.SendCodeToUpdatePassword;
using MassTransit;
using RazorLight;

namespace MessageQueues.SendCodeToUpdatePassword;

public class SendCodeToUpdatePasswordConsumer: IConsumer<SendCodeToUpdatePasswordEvent>
{
    private readonly ISmtpEmailService _smtpEmailService;

    public SendCodeToUpdatePasswordConsumer(ISmtpEmailService smtpEmailService)
    {
        _smtpEmailService = smtpEmailService;
    }

    public async Task Consume(ConsumeContext<SendCodeToUpdatePasswordEvent> context)
    {
        var emailPagePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Common", "ConfirmCodeResetPassword.cshtml");
        
        if (!File.Exists(emailPagePath))
        {
            throw new Exception("Шаблон для отправки сообщения отсутствует");
        }
        
        var razor = new RazorLightEngineBuilder()
            .UseMemoryCachingProvider()
            .Build();

        var template = await File.ReadAllTextAsync(emailPagePath);

        var htmlContent = await razor.CompileRenderStringAsync("template", template, context.Message);

        await _smtpEmailService.SendEmail(context.Message.Email, "Сброс пароля в RemotePowerLink",
            htmlContent);
    }
}