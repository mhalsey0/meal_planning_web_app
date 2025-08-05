import React, {useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'


import "./Calendar.css";

function Calendar() {
  const handleDateClick = () => {

  }
  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[ dayGridPlugin, interactionPlugin ]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "title",
          center: "",
          end: "today prev,next"
        }}
      />
    </div>
  )
}

export default Calendar;