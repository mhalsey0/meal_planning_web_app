import React, { useState, useEffect } from 'react';
import './ShoppingListTableView.css';

function ShoppingListTableView() {
    const [shoppingLists, setShoppingLists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroceryLists();
    }, []);

    const fetchGroceryLists = async () => {
        try {
            const response = await fetch('/GroceryList', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setShoppingLists(data);
            } else {
                console.error('Failed to fetch grocery lists');
                setShoppingLists([]);
            }
        } catch (error) {
            console.error('Error fetching grocery lists:', error);
            setShoppingLists([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="shopping-list-loading">Loading shopping lists...</div>;
    }

    return (
        <div className="shopping-list-container">
            <h2>Shopping Lists</h2>
            {shoppingLists.length === 0 ? (
                <p>No shopping lists found. Create one by selecting dates in the calendar!</p>
            ) : (
                <div className="shopping-lists-grid">
                    {shoppingLists.map(list => (
                        <div key={list.id} className="shopping-list-card">
                            <h3>{list.name}</h3>
                            <p>{list.items?.length || 0} items</p>
                            <button className="view-list-btn">View List</button>
                        </div>
                    ))}
                </div>
            )}
            <button className="create-list-btn">Create New List</button>
        </div>
    );
}

export default ShoppingListTableView;
