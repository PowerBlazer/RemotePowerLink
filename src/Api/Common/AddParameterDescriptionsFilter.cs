using JetBrains.Annotations;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Api.Common;

[UsedImplicitly]
public class AddParameterDescriptionsFilter: IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        foreach (var parameter in operation.Parameters)
        {
            var description = context.ApiDescription.ParameterDescriptions
                .FirstOrDefault(x => x.Name == parameter.Name)?.ModelMetadata.Description;
            
            if (description != null)
            {
                parameter.Description = description;
            }
        }
    }
}