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

  // Load events from database on component mount
  useEffect(() => {
    const loadScheduledMeals = async () => {
      try {
        const response = await fetch('/ScheduledMeal', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const scheduledMeals = await response.json();
          console.log('Calendar: Loaded scheduled meals from database:', scheduledMeals);
          
          // Convert scheduled meals to calendar events
          const calendarEvents = scheduledMeals.map(meal => ({
            id: `meal_${meal.id}`,
            title: meal.recipeName,
            start: meal.scheduledDate.split('T')[0], // Extract date part
            extendedProps: {
              type: 'meal',
              recipeId: meal.recipeId,
              scheduledMealId: meal.id,
              recipe: {
                id: meal.recipeId,
                name: meal.recipeName,
                description: meal.recipeDescription
              }
            }
          }));
          
          setEvents(calendarEvents);
        } else {
          console.error('Calendar: Failed to load scheduled meals');
        }
      } catch (error) {
        console.error('Calendar: Error loading scheduled meals:', error);
      }
    };

    loadScheduledMeals();
  }, []);

  // Remove the localStorage save effect since we're now using the database

  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr;
    console.log('Calendar: Date clicked, setting selectedDate to:', clickedDate);
    setSelectedDate(clickedDate);
    setMenuPosition({ x: arg.jsEvent.clientX, y: arg.jsEvent.clientY });
    setShowMenu(true);
    setShowSearch(false);
  };

  const handleEventClick = (arg) => {
    // Don't automatically remove events anymore - removal is handled by the "x" button
    console.log('Calendar: Event clicked:', arg.event.title);
    // You could add other event click behaviors here if needed
  };

  const scheduleMeal = () => {
    console.log('Calendar: scheduleMeal called, selectedDate:', selectedDate);
    setShowSearch(true);
    setShowMenu(false);
    // Don't clear selectedDate here - keep it for recipe selection
  };

  const removeMeal = async (eventId) => {
    console.log('Calendar: Removing meal with ID:', eventId);
    
    // Extract the scheduled meal ID from the event ID
    const scheduledMealId = eventId.replace('meal_', '');
    
    try {
      const response = await fetch(`/ScheduledMeal/${scheduledMealId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Calendar: Successfully deleted meal from database');
        setEvents(prevEvents => {
          const updatedEvents = prevEvents.filter(event => event.id !== eventId);
          console.log('Calendar: Updated events after removal:', updatedEvents);
          return updatedEvents;
        });
      } else {
        console.error('Calendar: Failed to delete meal from database');
        alert('Failed to remove meal. Please try again.');
      }
    } catch (error) {
      console.error('Calendar: Error deleting meal from database:', error);
      alert('Error removing meal. Please try again.');
    }
  };

  const clearAllEvents = async () => {
    console.log('Calendar: Clearing all events');
    
    // For now, we'll just clear the local state
    // In a full implementation, you might want to add a bulk delete endpoint
    setEvents([]);
    
    // Note: This doesn't clear from database - you'd need a bulk delete endpoint for that
    console.log('Calendar: Cleared local events (database records remain)');
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

  const handleRecipeSelect = async (recipe) => {
    console.log('Calendar: handleRecipeSelect called with:', recipe);
    console.log('Calendar: selectedDate is:', selectedDate);
    console.log('Calendar: selectedDate type:', typeof selectedDate);
    console.log('Calendar: selectedDate truthy check:', !!selectedDate);
    
    if (selectedDate) {
      try {
        // Save to database
        const response = await fetch('/ScheduledMeal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipeId: recipe.id,
            scheduledDate: selectedDate
          }),
          credentials: 'include',
        });

        if (response.ok) {
          const savedMeal = await response.json();
          console.log('Calendar: Saved meal to database:', savedMeal);
          
          // Create calendar event from saved meal
          const newEvent = {
            id: `meal_${savedMeal.id}`,
            title: savedMeal.recipeName,
            start: selectedDate,
            extendedProps: {
              type: 'meal',
              recipeId: savedMeal.recipeId,
              scheduledMealId: savedMeal.id,
              recipe: {
                id: savedMeal.recipeId,
                name: savedMeal.recipeName,
                description: savedMeal.recipeDescription
              }
            }
          };
          
          console.log('Calendar: Creating new event:', newEvent);
          setEvents(prevEvents => {
            const updatedEvents = [...prevEvents, newEvent];
            console.log('Calendar: Updated events after adding:', updatedEvents);
            console.log('Calendar: Total events count:', updatedEvents.length);
            return updatedEvents;
          });
          
          // Show success message
          alert(`"${recipe.name}" has been scheduled for ${selectedDate}!`);
          
          closeSearchModal();
        } else {
          console.error('Calendar: Failed to save meal to database');
          alert('Failed to schedule meal. Please try again.');
        }
      } catch (error) {
        console.error('Calendar: Error saving meal to database:', error);
        alert('Error scheduling meal. Please try again.');
      }
    } else {
      console.log('Calendar: No selected date available');
      console.log('Calendar: Current state - showSearch:', showSearch, 'showMenu:', showMenu);
      alert('No date selected. Please click on a calendar day first.');
    }
  };

  const closeSearchModal = () => {
    console.log('Calendar: closeSearchModal called, selectedDate was:', selectedDate);
    setShowSearch(false);
    setSelectedDate(null);
  };

  const closeMenu = () => {
    console.log('Calendar: closeMenu called, showSearch:', showSearch, 'selectedDate:', selectedDate);
    setShowMenu(false);
    // Only clear selectedDate if we're not transitioning to search
    if (!showSearch) {
      setSelectedDate(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log('Calendar: Click outside detected, target:', event.target);
      console.log('Calendar: Closest calendar-menu:', event.target.closest('.calendar-menu'));
      console.log('Calendar: Closest fc-day:', event.target.closest('.fc-day'));
      console.log('Calendar: Closest search-overlay:', event.target.closest('.search-overlay'));
      
      // Only close menu if clicking outside both menu and search overlay
      if (!event.target.closest('.calendar-menu') && 
          !event.target.closest('.fc-day') && 
          !event.target.closest('.search-overlay')) {
        console.log('Calendar: Closing menu due to outside click');
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
            <button onClick={closeSearchModal} className="close-btn">Cancel</button>
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
          {/* <button onClick={removeMeal} className="menu-option">Remove a Meal</button> */}
          {/* <button onClick={selectDayForGroceryList} className="menu-option">Select Day for Grocery List</button> */}
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
        eventContent={(arg) => {
          const recipe = arg.event.extendedProps.recipe;
          return (
            <div className="calendar-event" title={recipe ? `${recipe.name}${recipe.description ? ` - ${recipe.description}` : ''}` : arg.event.title}>
              <span className="event-title">{arg.event.title}</span>
              <button 
                className="event-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeMeal(arg.event.id);
                }}
                title="Remove meal"
              >
                ×
              </button>
            </div>
          );
        }}
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