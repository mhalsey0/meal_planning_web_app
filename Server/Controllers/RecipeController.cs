using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class RecipeController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public RecipeController(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        public class IngredientDto
        {
            public string Name { get; set; }
            public decimal Quantity { get; set; }
            public string Unit { get; set; }
            public string? Note { get; set; }
        }

        public class RecipeCreateDto
        {
            public string Name { get; set; }
            public string? Description { get; set; }
            public string? Instructions { get; set; }
            public string? ServingSize { get; set; }
            public List<IngredientDto> Ingredients { get; set; } = new();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchRecipes([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(new List<object>());

            var recipes = await _db.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .Where(r => r.Name.ToLower().Contains(query.ToLower()) || 
                           (r.Description != null && r.Description.ToLower().Contains(query.ToLower())))
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Description,
                    r.Instructions,
                    r.ServingSize,
                    Ingredients = r.RecipeIngredients.Select(ri => new
                    {
                        ri.Ingredient.Name,
                        ri.Quantity,
                        ri.Unit,
                        ri.Note
                    }).ToList()
                })
                .ToListAsync();

            return Ok(recipes);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecipe([FromBody] RecipeCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Recipe name is required.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Unauthorized();

            var recipe = new Recipe
            {
                Name = dto.Name,
                Description = dto.Description,
                Instructions = dto.Instructions,
                ServingSize = dto.ServingSize ?? string.Empty,
                UserId = userId,
                User = user
            };

            // Add ingredients
            foreach (var ing in dto.Ingredients)
            {
                // Try to find existing ingredient by name (case-insensitive)
                var ingredient = await _db.Ingredients.FirstOrDefaultAsync(i => i.Name.ToLower() == ing.Name.ToLower());
                if (ingredient == null)
                {
                    ingredient = new Ingredient { Name = ing.Name };
                    _db.Ingredients.Add(ingredient);
                    await _db.SaveChangesAsync(); // Save to get Id
                }
                var recipeIngredient = new RecipeIngredient
                {
                    IngredientId = ingredient.Id,
                    Ingredient = ingredient,
                    Quantity = ing.Quantity,
                    Unit = ing.Unit,
                    Note = ing.Note
                };
                recipe.RecipeIngredients.Add(recipeIngredient);
            }

            _db.Recipes.Add(recipe);
            await _db.SaveChangesAsync();

            // Optionally, include ingredients in the response
            var result = await _db.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.Id == recipe.Id);

            return Ok(result);
        }
    }
}