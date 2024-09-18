using Application.Layers.Email;
using Application.Layers.MessageQueues.SendCodeToConfirmNewEmail;
using MassTransit;
using RazorLight;

namespace MessageQueues.SendCodeToConfirmNewEmail;

public class SendCodeToConfirmNewEmailConsumer: IConsumer<SendCodeToConfirmNewEmailEvent>
{
    private readonly ISmtpEmailService _smtpEmailService;

    public SendCodeToConfirmNewEmailConsumer(ISmtpEmailService smtpEmailService)
    {
        _smtpEmailService = smtpEmailService;
    }

    public async Task Consume(ConsumeContext<SendCodeToConfirmNewEmailEvent> context)
    {
        var emailPagePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Common", "ConfirmNewEmail.cshtml");
        
        if (!File.Exists(emailPagePath))
        {
            throw new Exception("Шаблон для отправки сообщения отсутствует");
        }
        
        var razor = new RazorLightEngineBuilder()
            .UseMemoryCachingProvider()
            .Build();

        var template = await File.ReadAllTextAsync(emailPagePath);

        var htmlContent = await razor.CompileRenderStringAsync("template", template, context.Message);

        await _smtpEmailService.SendEmailAsync(context.Message.Email, "Потдверждение почтового ящика в RemotePowerLink",
            htmlContent);
    }
}