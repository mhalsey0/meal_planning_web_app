namespace Server.Data
{
    public class GroceryList
    {
        public GroceryList()
        {
        }

        public int Id { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public required string Name { get; set; }

        // User association
        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }

        // Navigations
        public ICollection<GroceryListItem> Items { get; set; } = new List<GroceryListItem>();
    }
}
