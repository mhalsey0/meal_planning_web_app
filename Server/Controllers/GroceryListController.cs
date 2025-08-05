using Microsoft.AspNetCore.Mvc;
using Server.Services;

namespace Server.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class GroceryListController : ControllerBase
    {
        private readonly GroceryListBuilder _builder;

        public GroceryListController(GroceryListBuilder builder)
        {
            _builder = builder;
        }

        [HttpPost("build")]
        public async Task<IActionResult> BuildGroceryList([FromBody] List<int> recipeIds, CancellationToken ct)
        {
            var items = await _builder.BuildAsync(recipeIds, ct);
            return Ok(items); // ASP.NET will serialize `items` to JSON
        }
    }
}