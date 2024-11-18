using Application.Layers.MessageQueues.UserRegistered;
using Application.Layers.Persistence;
using Application.Layers.Persistence.Repository;
using Domain.Entities;
using MassTransit;

namespace MessageQueues.UserRegistered;


public class UserRegisteredConsumer: IConsumer<UserRegisteredEvent>
{
    private readonly IUserRepository _userRepository;
    private readonly ITerminalSettingRepository _terminalSettingRepository;
    private readonly IPersistenceUnitOfWork _persistenceUnitOfWork;
    public UserRegisteredConsumer(IUserRepository userRepository, 
        IPersistenceUnitOfWork persistenceUnitOfWork, 
        ITerminalSettingRepository terminalSettingRepository)
    {
        _userRepository = userRepository;
        _persistenceUnitOfWork = persistenceUnitOfWork;
        _terminalSettingRepository = terminalSettingRepository;
    }

    public Task Consume(ConsumeContext<UserRegisteredEvent> context)
    {
        return _persistenceUnitOfWork.ExecuteWithExecutionStrategyAsync(async () =>
        {
            var user = await _userRepository.AddUser(new User
            {
                UserId = context.Message.UserId,
                Username = context.Message.UserName
            });

            await _terminalSettingRepository.AddTerminalSetting(new TerminalSetting
            {
                FontSize = 14,
                TerminalThemeId = 1,
                UserId = user.UserId
            });
        });


    }
}