using Application.Layers.Email;
using Application.Layers.MessageQueues.SendCodeToChangeEmail;
using MassTransit;
using RazorLight;

namespace MessageQueues.SendCodeToChangeEmail;

public class SendCodeToChangeEmailConsumer: IConsumer<SendCodeToChangeEmailEvent>
{
    private readonly ISmtpEmailService _smtpEmailService;

    public SendCodeToChangeEmailConsumer(ISmtpEmailService smtpEmailService)
    {
        _smtpEmailService = smtpEmailService;
    }


    public async Task Consume(ConsumeContext<SendCodeToChangeEmailEvent> context)
    {
        var emailPagePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Common", "ConfirmChangeEmail.cshtml");
        
        if (!File.Exists(emailPagePath))
        {
            throw new Exception("Шаблон для отправки сообщения отсутствует");
        }
        
        var razor = new RazorLightEngineBuilder()
            .UseMemoryCachingProvider()
            .Build();

        var template = await File.ReadAllTextAsync(emailPagePath);

        var htmlContent = await razor.CompileRenderStringAsync("template", template, context.Message);

        await _smtpEmailService.SendEmail(context.Message.Email, "Изменени почтового ящика в RemotePowerLink",
            htmlContent);
    }
}