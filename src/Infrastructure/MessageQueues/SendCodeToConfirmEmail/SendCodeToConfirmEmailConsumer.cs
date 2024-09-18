using Application.Layers.Email;
using Application.Layers.MessageQueues.SendCodeToConfirmEmail;
using JetBrains.Annotations;
using MassTransit;
using RazorLight;

namespace MessageQueues.SendCodeToConfirmEmail;


[UsedImplicitly]
public class SendCodeToConfirmEmailConsumer: IConsumer<SendCodeToConfirmEmailEvent>
{
    private readonly ISmtpEmailService _smtpEmailService;

    public SendCodeToConfirmEmailConsumer(ISmtpEmailService smtpEmailService)
    {
        _smtpEmailService = smtpEmailService;
    }

    public async Task Consume(ConsumeContext<SendCodeToConfirmEmailEvent> context)
    {
        var emailPagePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Common", "ConfirmEmailPage.cshtml");
        
        if (!File.Exists(emailPagePath))
        {
            throw new Exception("Шаблон для отправки сообщения отсутствует");
        }
        
        var razor = new RazorLightEngineBuilder()
            .UseMemoryCachingProvider()
            .Build();

        var template = await File.ReadAllTextAsync(emailPagePath);

        var htmlContent = await razor.CompileRenderStringAsync("template", template, context.Message);

        await _smtpEmailService.SendEmailAsync(context.Message.Email, "Подтверждение почты в RemotePowerLink",
            htmlContent);
    }
}