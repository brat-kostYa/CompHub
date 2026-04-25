using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace CompHub.WebApi.Infrastructure.ModelBinders
{
    /// <summary>
    /// Activates <see cref="SpecificationFilterModelBinder"/> specifically for
    /// <c>Dictionary&lt;int, List&lt;string&gt;&gt;</c> properties named <c>Specifications</c>.
    /// The name check prevents the binder from accidentally intercepting unrelated dictionaries.
    /// </summary>
    public class SpecificationFilterModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder? GetBinder(ModelBinderProviderContext context)
        {
            ArgumentNullException.ThrowIfNull(context);

            if (context.Metadata.ModelType == typeof(Dictionary<int, List<string>>) &&
                string.Equals(context.Metadata.Name, "Specifications", StringComparison.OrdinalIgnoreCase))
            {
                return new SpecificationFilterModelBinder();
            }

            return null;
        }
    }
}
