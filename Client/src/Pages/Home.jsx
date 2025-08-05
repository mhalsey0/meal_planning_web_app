import React, { useState } from 'react';
import WeatherForecast from "../Components/WeatherForecast.jsx";
import LogoutLink from "../Components/LogoutLink.jsx";
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.jsx";
import NavBar from "../Components/NavigationBar.jsx";
import Calendar from "../Components/Calendar.jsx";
import SearchBar from "../Components/Search.jsx";
import ShoppingListTableView from "../Components/ShoppingListTableView.jsx";

function Home() {
    const [activeView, setActiveView] = useState('calendar');

    const handleViewChange = (view) => {
        setActiveView(view);
    };

    const renderActiveComponent = () => {
        switch (activeView) {
            case 'calendar':
                return <Calendar />;
            case 'shopping':
                return <ShoppingListTableView />;
            case 'recipes':
                return <div className="recipes-placeholder">Recipes component coming soon...</div>;
            case 'ingredients':
                return <div className="ingredients-placeholder">Ingredients component coming soon...</div>;
            default:
                return <Calendar />;
        }
    };

    return (
        <div className="home-container">
            <AuthorizeView>
                <div className="logout">
                    <LogoutLink>Logout <AuthorizedUser value="email" /></LogoutLink>
                </div>
                <div className="navbar">
                    <NavBar onViewChange={handleViewChange} activeView={activeView} />
                </div>
                <div className="main-content">
                    {renderActiveComponent()}
                </div>
            </AuthorizeView>
        </div>
    );
}

export default Home;