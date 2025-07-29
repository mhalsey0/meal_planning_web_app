using Microsoft.EntityFrameworkCore;

namespace meal_Planning_Console
{
    public class Recipe : DbContext, IQueryable 
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public string Name { get; set;}
        public string Description { get; set;}
        public string Instructions { get; set;}
        public List<Ingredient> Ingredients { get; set;}
        public string ServingSize { get; set;} = "";

        //Constructors
        public Recipe(string name, string description, string instructions, List<Ingredient> ingredients, string servingSize)
        {
            this.Name = name;
            this.Description = description;
            this.Instructions = instructions;
            this.Ingredients = ingredients;
            this.ServingSize = servingSize;
            allRecipes.Add(this);
        }

        public Recipe()
        {
            allRecipes.Add(this);
        }

        private static readonly List<Recipe> allRecipes = [];

        public static List<Recipe> GetRecipes()
        {
            return allRecipes;
        }

        public void Write()
        {
            throw new NotImplementedException();
        }

        public void Read()
        {
            throw new NotImplementedException();
        }

        public void Save()
        {
            throw new NotImplementedException();
        }
    }
}