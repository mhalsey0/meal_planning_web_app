using Microsoft.EntityFrameworkCore;

namespace meal_Planning_Console
{
    public class Ingredient : DbContext, IQueryable 
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public double Amount { get; set; }
        public string Unit { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }

        public void Read()
        {
            throw new NotImplementedException();
        }

        public void Save()
        {
            throw new NotImplementedException();
        }

        public void Write()
        {
            throw new NotImplementedException();
        }
    }
}