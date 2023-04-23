import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { type RootState } from '../app/store'
import { useMarkEventMutation, useUnmarkEventMutation, type Event } from '../services/api'

export const EventList = ({ events }: { events: Event[] }): JSX.Element => {
  return <>
        {events.map(event => (
            <EventCard event={event} key={event.id} />
        ))}
    </>
}

const EventCard = ({ event }: { event: Event }): JSX.Element => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.refreshToken !== null)
  const startDate = new Date(event.start).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })
  const endDate = new Date(event.end).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })

  return (
      <div className="h-52 py-1 my-5 bg-gray-200 rounded-lg text-center border border-gray-300 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <p className="text-lg font-medium mb-2">
            <Link to={event.id} className="text-green-500 hover:underline p-2">
              {event.name}
            </Link>
          </p>
          <p className="text-base text-gray-600 mb-2">{`${startDate} - ${endDate}`}</p>
          <p className="text-base text-gray-600 mb-2">{event.location}</p>
        {isLoggedIn ? <MarkButton isMarked={event.is_marked} eventId={event.id} /> : null}
        </div>
      </div>
  )
}

const MarkButton = ({ eventId, isMarked }: { eventId: string, isMarked: boolean }): JSX.Element => {
  const text = isMarked ? 'unmark' : 'mark'
  const [mark, _d] = useMarkEventMutation()
  const [unmark, _] = useUnmarkEventMutation()

  const onClick = async (): Promise<void> => {
    if (isMarked) {
      await unmark(eventId)
      return
    }

    await mark(eventId)
  }

  return (
      <button
          onClick={() => {
            void onClick()
          }}
          className="bg-green-500 text-white px-3 py-1 rounded-md font-medium hover:bg-green-600"
      >
        {text}
      </button>
  )
}
