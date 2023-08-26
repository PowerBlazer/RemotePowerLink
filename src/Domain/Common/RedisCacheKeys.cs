namespace Domain.Common;

public static class RedisCacheKeys
{
    private const string ChatsByUserIdTemplate = "chats-userId={0}";

    public static string GetKeyChatsByUser(long userId)
    {
        return string.Format(ChatsByUserIdTemplate, userId);
    }
}