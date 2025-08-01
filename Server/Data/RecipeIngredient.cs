namespace Server.Data
{
    public class RecipeIngredient
    {
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }

        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; }

        // Per-recipe amounts/units
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public string? Note { get; set; }
    }
}
