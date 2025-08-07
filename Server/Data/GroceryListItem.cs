namespace Server.Data
{
    public class GroceryListItem
    {
        public int GroceryListId { get; set; }
        public GroceryList? GroceryList { get; set; }

        public int IngredientId { get; set; }
        public Ingredient? Ingredient { get; set; }

        public decimal? Quantity { get; set; }
        public string? Unit { get; set; }
        public bool IsChecked { get; set; }
        public string? Note { get; set; }
    }
}
