namespace Server.Data
{
    public class GroceryList
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public string Name { get; set; }

        // Navigations
        public ICollection<GroceryListItem> Items { get; set; } = new List<GroceryListItem>();
    }
}
