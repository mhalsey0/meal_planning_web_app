using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Services;
using System.Security.Claims;

namespace Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class GroceryListController : ControllerBase
    {
        private readonly GroceryListBuilder _builder;
        private readonly ApplicationDbContext _db;

        public GroceryListController(GroceryListBuilder builder, ApplicationDbContext db)
        {
            _builder = builder;
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetGroceryLists()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var lists = await _db.GroceryLists
                .Include(gl => gl.Items)
                .ThenInclude(gli => gli.Ingredient)
                .Where(gl => gl.UserId == userId)
                .Select(gl => new
                {
                    gl.Id,
                    gl.Name,
                    gl.CreatedDate,
                    Items = gl.Items.Select(gli => new
                    {
                        gli.Ingredient.Name,
                        gli.Quantity,
                        gli.Unit,
                        gli.IsChecked,
                        gli.Note
                    }).ToList()
                })
                .ToListAsync();

            return Ok(lists);
        }

        [HttpPost("build")]
        public async Task<IActionResult> BuildGroceryList([FromBody] List<int> recipeIds)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            if (recipeIds == null || !recipeIds.Any())
                return BadRequest("No recipe IDs provided.");

            try
            {
                var items = await _builder.BuildAsync(recipeIds);

                // Create a new grocery list
                var groceryList = new GroceryList
                {
                    Name = $"Grocery List - {DateTime.Now:MMM dd, yyyy}",
                    UserId = userId,
                    Items = items.Select(item => new GroceryListItem
                    {
                        IngredientId = item.IngredientId,
                        Quantity = item.Quantity,
                        Unit = item.Unit,
                        IsChecked = false,
                        Note = item.Note
                    }).ToList()
                };

                _db.GroceryLists.Add(groceryList);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Grocery list created successfully", id = groceryList.Id });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating grocery list: {ex.Message}");
            }
        }
    }
}