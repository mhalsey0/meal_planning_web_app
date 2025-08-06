namespace Server.Data
{
    public class Recipe
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Instructions { get; set; }
        public string ServingSize { get; set; } = string.Empty;

        // User association
        public required string UserId { get; set; }
        public required ApplicationUser User { get; set; }

        // Navigations
        public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();
    }
}