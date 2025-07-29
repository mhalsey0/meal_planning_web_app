namespace meal_Planning_Console
{
    public interface IQueryable
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Name { get; set; }

        void Write();

        void Read();

        void Save();
    }
}