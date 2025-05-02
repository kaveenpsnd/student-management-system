import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState } from "react"

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

const events = [
  {
    title: "Science Fair",
    start: new Date(2025, 4, 4, 9, 0),
    end: new Date(2025, 4, 4, 12, 0),
  },
  {
    title: "Parent Meeting",
    start: new Date(2025, 4, 5, 14, 0),
    end: new Date(2025, 4, 5, 15, 30),
  },
]

function CalendarPage() {
  const [myEvents, setMyEvents] = useState(events)

  return (
    <div style={{ height: "80vh", padding: "20px" }}>
      <h2>📅 Event Calendar</h2>
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
      />
    </div>
  )
}

export default CalendarPage
