import React, {useState} from "react"
import {FaSearch} from "react-icons/fa"

import "./Input.css";

function SearchBar({ onRecipeSelect }) {
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async (value) => {
        if (!value.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/Recipe/search?query=${encodeURIComponent(value)}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Search results:', data);
                console.log('First recipe structure:', data[0]);
                setResults(data);
            } else {
                console.error('Search failed');
                setResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (value) => {
        setInput(value);
        // Debounce the search
        const timeoutId = setTimeout(() => {
            fetchData(value);
        }, 300);
        return () => clearTimeout(timeoutId);
    }

    const handleRecipeClick = (recipe) => {
        console.log('Recipe clicked:', recipe);
        console.log('Recipe ID:', recipe.id);
        console.log('Recipe name:', recipe.name);
        
        if (onRecipeSelect) {
            console.log('Calling onRecipeSelect with:', recipe);
            onRecipeSelect(recipe);
        } else {
            console.log('onRecipeSelect is not provided');
        }
    }

    const handleResultClick = (e, recipe) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Recipe result clicked:', recipe);
        handleRecipeClick(recipe);
        
        // Add visual feedback
        const element = e.currentTarget;
        element.style.backgroundColor = '#4caf50';
        element.style.color = 'white';
        
        // Reset after a short delay
        setTimeout(() => {
            element.style.backgroundColor = '';
            element.style.color = '';
        }, 200);
    }

    return (
        <div className="search-container">
            <div className="search-bar">
                <FaSearch id="search-icon" />
                <input 
                    placeholder="Search recipes..."
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>
            {loading && <div className="search-loading">Searching...</div>}
            {results.length > 0 && (
                <div className="search-results">
                    {results.map((recipe) => (
                        <div 
                            key={recipe.id} 
                            className="search-result-item clickable"
                            onClick={(e) => handleResultClick(e, recipe)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h4>{recipe.name}</h4>
                            {recipe.description && <p>{recipe.description}</p>}
                            {recipe.ingredients && recipe.ingredients.length > 0 && (
                                <div className="recipe-ingredients">
                                    <strong>Ingredients:</strong>
                                    <ul>
                                        {recipe.ingredients.map((ing, idx) => (
                                            <li key={idx}>
                                                {ing.quantity} {ing.unit} {ing.name}
                                                {ing.note && ` (${ing.note})`}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchBar;