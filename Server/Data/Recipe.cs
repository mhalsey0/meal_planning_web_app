namespace Server.Data
{
    public class Recipe
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public string Name { get; set; }
        public string? Description { get; set; }
        public string? Instructions { get; set; }
        public string ServingSize { get; set; } = string.Empty;

        // Navigations
        public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();
    }
}