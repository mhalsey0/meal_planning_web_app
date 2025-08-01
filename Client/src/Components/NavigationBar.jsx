import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';

export default function NavBar(){
    return (
        <nav>
            <ul>
                <a>
                    <li>Calendar</li>
                </a>
                <a>
                    <li>Shopping</li>
                </a>
                <a>
                    <li>Recipes</li>
                </a>
                <a>
                    <li>Ingredients</li>
                </a>
            </ul>
        </nav>
    )
}