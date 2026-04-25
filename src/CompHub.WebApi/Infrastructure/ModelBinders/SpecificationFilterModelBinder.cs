
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.RegularExpressions;

/// <summary>
/// Binds query string parameters in the format
/// <c>specifications[{keyId}]=value</c> to <see cref="Dictionary{TKey,TValue}"/>
/// where TKey is <see cref="int"/> and TValue is <see cref="List{String}"/>.
/// 
/// <para>Example URL: /api/products?specifications[1]=LGA1700&amp;specifications[2]=6</para>
/// </summary>
public class SpecificationFilterModelBinder : IModelBinder
{
    private static readonly Regex KeyPattern = new(@"^specifications\[(\d+)\]$", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        ArgumentNullException.ThrowIfNull(bindingContext);

        var query = bindingContext.HttpContext.Request.Query;
        var result = new Dictionary<int, List<string>>();

        foreach (var (key, rawValues) in query)
        {
            var match = KeyPattern.Match(key);
            if (!match.Success) continue;
            if (!int.TryParse(match.Groups[1].Value, out var keyId)) continue;

            var values = rawValues
                .Where(v => !string.IsNullOrWhiteSpace(v))
                .ToList();

            if (values.Count == 0) continue;

            result[keyId] = values!;
        }

        bindingContext.Result = result.Count > 0
            ? ModelBindingResult.Success(result)
            : ModelBindingResult.Success(null);

        return Task.CompletedTask;
    }
}