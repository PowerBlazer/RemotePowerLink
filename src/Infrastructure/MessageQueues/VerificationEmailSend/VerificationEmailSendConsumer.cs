using Domain.Layers.Email;
using Domain.Layers.MessageQueues.VerificationEmailSend;
using JetBrains.Annotations;
using MassTransit;
using RazorLight;

namespace MessageQueues.VerificationEmailSend;


[UsedImplicitly]
public class VerificationEmailSendConsumer: IConsumer<VerificationEmailSendEvent>
{
    private readonly ISmtpEmailService _smtpEmailService;

    public VerificationEmailSendConsumer(ISmtpEmailService smtpEmailService)
    {
        _smtpEmailService = smtpEmailService;
    }

    public async Task Consume(ConsumeContext<VerificationEmailSendEvent> context)
    {
        var emailPagePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Common","EmailPage.cshtml");
        
        if (!File.Exists(emailPagePath))
        {
            throw new Exception("Шаблон для отправки сообщения отсутствует");
        }
        
        var razor = new RazorLightEngineBuilder()
            .UseMemoryCachingProvider()
            .Build();

        var template = await File.ReadAllTextAsync(emailPagePath);

        var htmlContent = await razor.CompileRenderStringAsync("template", template,context.Message);

        await _smtpEmailService.SendEmailAsync(context.Message.Email, "Подтверждение почты в RemotePowerLink",
            htmlContent);
    }
}