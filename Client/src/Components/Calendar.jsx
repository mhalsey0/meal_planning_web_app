import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import SearchBar from './Search'

import "./Calendar.css";

function Calendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [groceryListMode, setGroceryListMode] = useState(false);
  const [groceryListDates, setGroceryListDates] = useState([]);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr;
    setSelectedDate(clickedDate);
    setMenuPosition({ x: arg.jsEvent.clientX, y: arg.jsEvent.clientY });
    setShowMenu(true);
    setShowSearch(false);
  };

  const handleEventClick = (arg) => {
    // Handle clicking on existing events (for removal)
    if (arg.event.extendedProps.type === 'meal') {
      removeMeal(arg.event.id);
    }
  };

  const scheduleMeal = () => {
    setShowSearch(true);
    setShowMenu(false);
  };

  const removeMeal = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const selectDayForGroceryList = () => {
    setGroceryListMode(true);
    setGroceryListDates([selectedDate]);
    setShowMenu(false);
  };

  const handleGroceryListDateSelect = (dateStr) => {
    if (groceryListMode) {
      const newDates = [...groceryListDates, dateStr];
      setGroceryListDates(newDates);
      
      // If we have at least 2 dates, create the grocery list
      if (newDates.length >= 2) {
        createGroceryList(newDates);
        setGroceryListMode(false);
        setGroceryListDates([]);
      }
    }
  };

  const createGroceryList = async (dateRange) => {
    try {
      // Get recipe IDs from events in the date range
      const recipeIds = events
        .filter(event => 
          event.extendedProps.type === 'meal' && 
          dateRange.includes(event.startStr.split('T')[0])
        )
        .map(event => event.extendedProps.recipeId);

      if (recipeIds.length === 0) {
        alert('No meals found in the selected date range.');
        return;
      }

      const response = await fetch('/GroceryList/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeIds),
        credentials: 'include',
      });

      if (response.ok) {
        alert('Grocery list created successfully!');
        // You might want to update the shopping lists component here
      } else {
        alert('Failed to create grocery list.');
      }
    } catch (error) {
      console.error('Error creating grocery list:', error);
      alert('Error creating grocery list.');
    }
  };

  const handleRecipeSelect = (recipe) => {
    if (selectedDate) {
      const newEvent = {
        id: `meal_${Date.now()}`,
        title: recipe.name,
        start: selectedDate,
        extendedProps: {
          type: 'meal',
          recipeId: recipe.id,
          recipe: recipe
        }
      };
      setEvents([...events, newEvent]);
      setShowSearch(false);
      setSelectedDate(null);
    }
  };

  const closeMenu = () => {
    setShowMenu(false);
    setSelectedDate(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.calendar-menu') && !event.target.closest('.fc-day')) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="calendar-container">
      {showSearch && (
        <div className="search-overlay">
          <div className="search-modal">
            <h3>Search for a Recipe</h3>
            <SearchBar onRecipeSelect={handleRecipeSelect} />
            <button onClick={() => setShowSearch(false)} className="close-btn">Cancel</button>
          </div>
        </div>
      )}
      
      {showMenu && (
        <div 
          className="calendar-menu"
          style={{
            position: 'fixed',
            left: menuPosition.x,
            top: menuPosition.y,
            zIndex: 1000
          }}
        >
          <button onClick={scheduleMeal} className="menu-option">Schedule a Meal</button>
          <button onClick={removeMeal} className="menu-option">Remove a Meal</button>
          <button onClick={selectDayForGroceryList} className="menu-option">Select Day for Grocery List</button>
        </div>
      )}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "title",
          center: "",
          end: "today prev,next"
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        dayCellClassNames={groceryListMode ? (arg) => {
          return groceryListDates.includes(arg.dateStr) ? ['grocery-list-day'] : [];
        } : undefined}
        dayCellDidMount={groceryListMode ? (arg) => {
          if (groceryListDates.includes(arg.dateStr)) {
            arg.el.addEventListener('click', () => handleGroceryListDateSelect(arg.dateStr));
          }
        } : undefined}
      />
    </div>
  );
}

export default Calendar;