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
        private readonly ILogger<RecipeController> _logger;

        public RecipeController(ApplicationDbContext db, UserManager<ApplicationUser> userManager, ILogger<RecipeController> logger)
        {
            _db = db;
            _userManager = userManager;
            _logger = logger;
        }

        public class IngredientDto
        {
            public string Name { get; set; } = string.Empty;
            public decimal Quantity { get; set; }
            public string Unit { get; set; } = string.Empty;
            public string? Note { get; set; }
        }

        public class RecipeCreateDto
        {
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; }
            public string? Instructions { get; set; }
            public string? ServingSize { get; set; }
            public List<IngredientDto> Ingredients { get; set; } = new();
        }

        public class RecipeResponseDto
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; }
            public string? Instructions { get; set; }
            public string ServingSize { get; set; } = string.Empty;
            public DateTime CreatedDate { get; set; }
            public List<IngredientResponseDto> Ingredients { get; set; } = new();
        }

        public class IngredientResponseDto
        {
            public string Name { get; set; } = string.Empty;
            public decimal Quantity { get; set; }
            public string Unit { get; set; } = string.Empty;
            public string? Note { get; set; }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchRecipes([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(new List<RecipeResponseDto>());

            var searchTerm = $"%{query}%";
            
            var recipes = await _db.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                .Where(r => EF.Functions.Like(r.Name, searchTerm) || 
                           (r.Description != null && EF.Functions.Like(r.Description, searchTerm)))
                .Select(r => new RecipeResponseDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Description = r.Description,
                    Instructions = r.Instructions,
                    ServingSize = r.ServingSize,
                    CreatedDate = r.CreatedDate,
                    Ingredients = r.RecipeIngredients.Select(ri => new IngredientResponseDto
                    {
                        Name = ri.Ingredient.Name,
                        Quantity = ri.Quantity,
                        Unit = ri.Unit,
                        Note = ri.Note
                    }).ToList()
                })
                .ToListAsync();

            return Ok(recipes);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecipe([FromBody] RecipeCreateDto dto)
        {
            try
            {
                _logger.LogInformation("Creating recipe: {Name}", dto.Name);

                if (string.IsNullOrWhiteSpace(dto.Name))
                    return BadRequest("Recipe name is required.");

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                    return Unauthorized("User not authenticated.");

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return Unauthorized("User not found.");

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
                    if (string.IsNullOrWhiteSpace(ing.Name))
                        continue; // Skip ingredients without names

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

                _logger.LogInformation("Recipe created successfully with ID: {Id}", recipe.Id);

                // Return a clean DTO without circular references
                var responseDto = new RecipeResponseDto
                {
                    Id = recipe.Id,
                    Name = recipe.Name,
                    Description = recipe.Description,
                    Instructions = recipe.Instructions,
                    ServingSize = recipe.ServingSize,
                    CreatedDate = recipe.CreatedDate,
                    Ingredients = recipe.RecipeIngredients.Select(ri => new IngredientResponseDto
                    {
                        Name = ri.Ingredient.Name,
                        Quantity = ri.Quantity,
                        Unit = ri.Unit,
                        Note = ri.Note
                    }).ToList()
                };

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating recipe");
                return BadRequest($"Error creating recipe: {ex.Message}");
            }
        }
    }
}