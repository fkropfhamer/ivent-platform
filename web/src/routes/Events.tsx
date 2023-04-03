import { type Event, useFetchEventsQuery } from '../services/api'
import { useEffect, useState } from 'react'
import { EventList } from '../components/EventList'
import { useSelector } from 'react-redux'
import { type RootState } from '../app/store'

export const Events = (): JSX.Element => {
  const [markedFilter, setMarkedFilter] = useState(false)
  const [page, setPage] = useState(0)
  const [events, setEvents] = useState<Event[]>([])
  const { data, isFetching } = useFetchEventsQuery({ page, marked: markedFilter ? '1' : undefined })
  const isLoggedIn = useSelector((state: RootState) => state.auth.refreshToken !== null)

  let showMore = false
  if (data != null) {
    showMore = data.count > events.length
  }

  useEffect(() => {
    if (data == null) {
      return
    }

    if (data.events.length > 0) {
      setEvents([...events, ...data.events])
    }
  }, [data])

  if (isFetching) {
    return <div>Loading</div>
  }

  return (
        <div className="w-full bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold mb-6">Events</h1>
            { isLoggedIn
              ? (<>marked<input
              type="checkbox"
              checked={markedFilter}
              onChange={() => { setEvents([]); setMarkedFilter(!markedFilter) }}
            /></>)
              : null}
            <EventList events={events} />
            {showMore
              ? (
                <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-lg mb-6"
                    onClick={() => { setPage(page + 1) }}
                >
                    more
                </button>
                )
              : null}
        </div>
  )
}
