import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';

function RecipeCard({recipeObject}) {
    return (
    <div className="recipe-card">
        <h2>{recipeObject.Name}</h2>
        <div className="ingredients">
            <ul>
                {recipeObject.RecipeIngredients.map((ingredient, index) =>
                    <li key={index}>{ingredient.Quantity} {ingredient.Name}</li>
                )}
            </ul>
        </div>
        <div className="instructions">
            <p>{recipeObject.Instructions}</p>
        </div>
        <div className="description">
            <p>{recipeObject.Description}</p>
        </div>
        <div className="serving-size">
            <p>{recipeObject.ServingSize}</p>
        </div>
    </div>
    );
}

export default RecipeCard;