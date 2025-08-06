import React from 'react';


export default function NavBar({ onViewChange, activeView }){
    const handleNavClick = (view) => {
        onViewChange(view);
    };

    return (
        <nav className="grid-component">
            <div 
                className={`nav-item ${activeView === 'calendar' ? 'active' : ''}`}
                onClick={() => handleNavClick('calendar')}
            >
                <p>Calendar</p>
            </div>
            <div 
                className={`nav-item ${activeView === 'shopping' ? 'active' : ''}`}
                onClick={() => handleNavClick('shopping')}
            >
                <p>Shopping Lists</p>
            </div>
            <div 
                className={`nav-item ${activeView === 'recipeForm' ? 'active' : ''}`}
                onClick={() => handleNavClick('recipeForm')}
            >
                <p>Add a Recipe</p>
            </div>
            {/* <div 
                className={`nav-item ${activeView === 'recipes' ? 'active' : ''}`}
                onClick={() => handleNavClick('recipes')}
            >
                <p>Recipes</p>
            </div>
            <div 
                className={`nav-item ${activeView === 'ingredients' ? 'active' : ''}`}
                onClick={() => handleNavClick('ingredients')}
            >
                <p>Ingredients</p>
            </div> */}
        </nav>
    )
}