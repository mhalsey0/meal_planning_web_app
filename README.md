## Meal Planning Calendar with React

## Description
A user based meal planning calendar that allows the creation of custom recipes and scheduling those recipes for a specific day. This project started with the .NET reactwebapi template.

## Feature Overview

- Uses React components like [FullCalendar](https://fullcalendar.io) for a responsive user and developer experience.
- Custom API backend that uses Vite and Swagger UI in the development environment for easy testing.
- SQLite database persists the user login, recipe, and calendar data.
- Saves user input and returns the input in both the log in process and in the recipe and meal scheduling process.

## How to Use

1. Navigate to the Server directory and run `dotnet run`.
2. copy and paste the exposed port that is published in the terminal to your browser.
3. Follow the instructions to create your account.
4. Log in.
5. Add a recipe by clicking on "Add a Recipe" and follow the instructions in the form.
6. Click on "Calendar", then click on a day and select "Schedule a Meal".
7. Search for the recipe that you added.
8. Select a recipe.

To remove a recipe, simply click the "X" next to the recipe that you want to remove. You may log out by clicking on the logout button in the bottom right corner.

Claude-3.5-sonnet was used in the process of building this project for design suggestions, testing, and debugging. Specific comments within the code denotes where AI generated code was used.