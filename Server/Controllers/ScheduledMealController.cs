
// AI helped create the ScheduledMealController to provide API endpoints for calendar persistence.
// This controller includes:
// - Suggesting DTO design pattern for many to many relationships
// - GET endpoint to retrieve user's scheduled meals
// - POST endpoint to create new scheduled meals with validation
// - DELETE endpoint to remove scheduled meals
// - Proper authentication and user isolation
// - DTOs for clean data transfer
// - Error handling and logging

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using System.Security.Claims;

namespace Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ScheduledMealController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<ScheduledMealController> _logger;

        public ScheduledMealController(ApplicationDbContext db, UserManager<ApplicationUser> userManager, ILogger<ScheduledMealController> logger)
        {
            _db = db;
            _userManager = userManager;
            _logger = logger;
        }

        public class ScheduledMealDto
        {
            public int Id { get; set; }
            public int RecipeId { get; set; }
            public string RecipeName { get; set; } = string.Empty;
            public string? RecipeDescription { get; set; }
            public DateTime ScheduledDate { get; set; }
            public DateTime CreatedDate { get; set; }
        }

        public class CreateScheduledMealDto
        {
            public int RecipeId { get; set; }
            public DateTime ScheduledDate { get; set; }
        }

        [HttpGet]
        public async Task<IActionResult> GetScheduledMeals()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                    return Unauthorized("User not authenticated.");

                var scheduledMeals = await _db.ScheduledMeals
                    .Include(sm => sm.Recipe)
                    .Where(sm => sm.UserId == userId)
                    .Select(sm => new ScheduledMealDto
                    {
                        Id = sm.Id,
                        RecipeId = sm.RecipeId,
                        RecipeName = sm.Recipe.Name,
                        RecipeDescription = sm.Recipe.Description,
                        ScheduledDate = sm.ScheduledDate,
                        CreatedDate = sm.CreatedDate
                    })
                    .ToListAsync();

                return Ok(scheduledMeals);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting scheduled meals");
                return BadRequest($"Error getting scheduled meals: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateScheduledMeal([FromBody] CreateScheduledMealDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                    return Unauthorized("User not authenticated.");

                // Verify the recipe exists and belongs to the user
                var recipe = await _db.Recipes
                    .FirstOrDefaultAsync(r => r.Id == dto.RecipeId && r.UserId == userId);
                
                if (recipe == null)
                    return NotFound("Recipe not found or not accessible.");

                var scheduledMeal = new ScheduledMeal
                {
                    UserId = userId,
                    RecipeId = dto.RecipeId,
                    ScheduledDate = dto.ScheduledDate.Date, // Store only the date part
                    CreatedDate = DateTime.UtcNow
                };

                _db.ScheduledMeals.Add(scheduledMeal);
                await _db.SaveChangesAsync();

                _logger.LogInformation("Scheduled meal created: Recipe {RecipeId} for date {Date}", dto.RecipeId, dto.ScheduledDate);

                // Return the created scheduled meal with recipe details
                var result = new ScheduledMealDto
                {
                    Id = scheduledMeal.Id,
                    RecipeId = scheduledMeal.RecipeId,
                    RecipeName = recipe.Name,
                    RecipeDescription = recipe.Description,
                    ScheduledDate = scheduledMeal.ScheduledDate,
                    CreatedDate = scheduledMeal.CreatedDate
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating scheduled meal");
                return BadRequest($"Error creating scheduled meal: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScheduledMeal(int id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                    return Unauthorized("User not authenticated.");

                var scheduledMeal = await _db.ScheduledMeals
                    .FirstOrDefaultAsync(sm => sm.Id == id && sm.UserId == userId);

                if (scheduledMeal == null)
                    return NotFound("Scheduled meal not found.");

                _db.ScheduledMeals.Remove(scheduledMeal);
                await _db.SaveChangesAsync();

                _logger.LogInformation("Scheduled meal deleted: ID {Id}", id);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting scheduled meal");
                return BadRequest($"Error deleting scheduled meal: {ex.Message}");
            }
        }
    }
} 