using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<GroceryList> GroceryLists { get; set; }

        // Join entities as suggested by ChatGPT to cover cases where different recipes have the same ingredient but different amounts
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
        public DbSet<GroceryListItem> GroceryListItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // RecipeIngredient: composite key and relationships
            builder.Entity<RecipeIngredient>()
                   .HasKey(ri => new { ri.RecipeId, ri.IngredientId });

            builder.Entity<RecipeIngredient>()
                   .HasOne(ri => ri.Recipe)
                   .WithMany(r => r.RecipeIngredients)
                   .HasForeignKey(ri => ri.RecipeId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<RecipeIngredient>()
                   .HasOne(ri => ri.Ingredient)
                   .WithMany(i => i.RecipeIngredients)
                   .HasForeignKey(ri => ri.IngredientId)
                   .OnDelete(DeleteBehavior.Restrict);

            // GroceryListItem: composite key and relationships
            builder.Entity<GroceryListItem>()
                   .HasKey(gli => new { gli.GroceryListId, gli.IngredientId });

            builder.Entity<GroceryListItem>()
                   .HasOne(gli => gli.GroceryList)
                   .WithMany(gl => gl.Items)
                   .HasForeignKey(gli => gli.GroceryListId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<GroceryListItem>()
                   .HasOne(gli => gli.Ingredient)
                   .WithMany(i => i.GroceryListItems)
                   .HasForeignKey(gli => gli.IngredientId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Optional: defaults/precision
            builder.Entity<Ingredient>()
                   .Property(i => i.CreatedDate)
                   .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<Recipe>()
                   .Property(r => r.CreatedDate)
                   .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<GroceryList>()
                   .Property(gl => gl.CreatedDate)
                   .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Entity<RecipeIngredient>()
                   .Property(ri => ri.Quantity)
                   .HasPrecision(18, 4);

            builder.Entity<GroceryListItem>()
                   .Property(gli => gli.Quantity)
                   .HasPrecision(18, 4);
        }
    }
}
