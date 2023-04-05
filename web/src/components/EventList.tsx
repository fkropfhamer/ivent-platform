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

  return <>
        <div className="h-52 py-1 my-5 bg-gray-200 rounded-lg text-center border border-gray-300 flex justify-center items-center">
            <Link to={event.id} className="text-green-500 hover:underline p-2">
                {event.name}
            </Link>
            {isLoggedIn ? <MarkButton isMarked={event.is_marked} eventId={event.id} /> : null}
        </div>
    </>
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

  return <button onClick={() => { void onClick() }}>
        {text}
    </button>
}