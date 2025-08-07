using System.ComponentModel.DataAnnotations;

namespace Server.Data
{
    public class ScheduledMeal
    {
        public int Id { get; set; }
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [Required]
        public int RecipeId { get; set; }
        
        [Required]
        public DateTime ScheduledDate { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public ApplicationUser User { get; set; } = null!;
        public Recipe Recipe { get; set; } = null!;
    }
} 