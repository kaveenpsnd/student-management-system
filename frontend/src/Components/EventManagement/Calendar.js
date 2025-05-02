import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import isBefore from "date-fns/isBefore"
import startOfDay from "date-fns/startOfDay"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../../styles/calendar.css"

const locales = {
  "en-US": require("date-fns/locale/en-US"),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

function CalendarPage() {
  const navigate = useNavigate()
  const [myEvents, setMyEvents] = useState([])

  const fetchApprovedEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events', {
        params: { status: 'Approved' }
      })
      
      const formattedEvents = response.data.map(event => ({
        title: event.eventName,
        start: new Date(event.date + 'T' + event.startTime),
        end: new Date(event.date + 'T' + event.endTime),
        type: event.eventType,
        grade: event.grade
      }))
      
      setMyEvents(formattedEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  useEffect(() => {
    fetchApprovedEvents()
  }, [])

  const handleSelect = ({ start, end }) => {
    const today = startOfDay(new Date())
    const selectedDate = startOfDay(start)
    
    if (isBefore(selectedDate, today)) {
      alert("Cannot select past dates")
      return
    }

    navigate('/add-event', { 
      state: { 
        selectedDate: start.toISOString()
      }
    })
  }

  const dayPropGetter = (date) => {
    const today = startOfDay(new Date())
    const isPast = isBefore(startOfDay(date), today)
    
    return {
      className: isPast ? 'rbc-off-range-bg' : '',
      style: {
        backgroundColor: isPast ? '#f5f5f5' : '',
        cursor: isPast ? 'not-allowed' : 'pointer'
      }
    }
  }

  const eventPropGetter = (event) => {
    let backgroundColor = '#3174ad' // default color
    
    // Different colors for different event types
    switch(event.type) {
      case 'Academic':
        backgroundColor = '#2ecc71' // green
        break
      case 'Sport':
        backgroundColor = '#e74c3c' // red
        break
      case 'Extra-Curricular':
        backgroundColor = '#f1c40f' // yellow
        break
      default:
        backgroundColor = '#3174ad' // default blue
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">📅 Event Calendar</h1>

      <div className="calendar-cards">
        <div className="calendar-card" onClick={() => navigate('/add-event')}>
          <h3>Add Event</h3>
          <p>Create new event</p>
        </div>
        <div className="calendar-card" onClick={() => navigate('/my-events')}>
          <h3>My Events</h3>
          <p>View your events</p>
        </div>
        <div className="calendar-card" onClick={() => navigate('/event-requests')}>
          <h3>Requests</h3>
          <p>Check pending approvals</p>
        </div>
      </div>

      <div className="calendar-content">
        <Calendar
          localizer={localizer}
          events={myEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectSlot={handleSelect}
          selectable
          min={new Date()}
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventPropGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
        />
      </div>
    </div>
  )
}

export default CalendarPage
