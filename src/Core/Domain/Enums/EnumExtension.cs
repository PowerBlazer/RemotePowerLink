using System.ComponentModel;

namespace Domain.Enums;

public static class EnumExtensions
{
    public static string GetDescription(this Enum value)
    {
        var field = value.GetType().GetField(value.ToString());
        
        if (field == null) 
            return value.ToString();
        
        var attribute = Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute));

        if (attribute is null) 
            return value.ToString();
            
        var descriptionAttribute = (DescriptionAttribute)attribute;

        return descriptionAttribute.Description;
    }
}