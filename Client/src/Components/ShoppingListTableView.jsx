import React, { useState, useEffect } from 'react';
import './ShoppingListTableView.css';

function ShoppingListTableView() {
    const [shoppingLists, setShoppingLists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch shopping lists from API
        // For now, using mock data
        // const mockLists = [
        //     { id: 1, name: 'Weekly Groceries', itemCount: 15 },
        //     { id: 2, name: 'Party Shopping', itemCount: 8 },
        //     { id: 3, name: 'Pantry Essentials', itemCount: 12 }
        // ];
        
        setTimeout(() => {
            setShoppingLists(mockLists);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return <div className="shopping-list-loading">Loading shopping lists...</div>;
    }

    return (
        <div className="shopping-list-container">
            <h2>Shopping Lists</h2>
            <div className="shopping-lists-grid">
                {shoppingLists.map(list => (
                    <div key={list.id} className="shopping-list-card">
                        <h3>{list.name}</h3>
                        <p>{list.itemCount} items</p>
                        <button className="view-list-btn">View List</button>
                    </div>
                ))}
            </div>
            <button className="create-list-btn">Create New List</button>
        </div>
    );
}

export default ShoppingListTableView;
