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
        if (onRecipeSelect) {
            onRecipeSelect(recipe);
        }
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
                            className="search-result-item"
                            onClick={() => handleRecipeClick(recipe)}
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