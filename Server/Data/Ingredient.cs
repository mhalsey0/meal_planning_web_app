namespace Server.Data
{
    public class Ingredient
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Navigations
        public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();
        public ICollection<GroceryListItem> GroceryListItems { get; set; } = new List<GroceryListItem>();
    }
}
