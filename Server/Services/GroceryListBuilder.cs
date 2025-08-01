using Microsoft.EntityFrameworkCore;
using Server.Data;

namespace Server.Services
{
    public sealed class GroceryListBuilder
    {
        private readonly ApplicationDbContext _db;
        public GroceryListBuilder(ApplicationDbContext db) => _db = db;

        public async Task<List<GroceryListItem>> BuildAsync(
            IEnumerable<int> recipeIds,
            CancellationToken ct = default)
        {
            // Aggregate server-side
            var items = await _db.RecipeIngredients
                .Where(ri => recipeIds.Contains(ri.RecipeId))
                .GroupBy(ri => new { ri.IngredientId, ri.Unit })
                .Select(g => new GroceryListItem
                {
                    IngredientId = g.Key.IngredientId,
                    Quantity     = g.Sum(x => x.Quantity),
                    Unit         = g.Key.Unit,
                    IsChecked    = false
                })
                .ToListAsync(ct);

            return items;
        }
    }
}
