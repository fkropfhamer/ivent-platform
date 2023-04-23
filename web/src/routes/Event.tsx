import { useParams } from 'react-router-dom'
import { useEventQuery } from '../services/api'

export const Event = (): JSX.Element => {
  let endDate
  const { id } = useParams<{ id: string }>()
  if (id == null) {
    return <>
            <h1>EventId not found 😔</h1>
        </>
  }
  const { data } = useEventQuery(id)

  if (data == null) {
    return (<></>)
  }

  const startDate = new Date(data.start).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })

  if (data.end != null) {
    endDate = new Date(data.end).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })
  } else {
    endDate = data.end
  }

  return (
      <div className="w-96 bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
          <h1 className="text-3xl text-center font-bold mb-6">Event</h1>
          {(data != null)
            ? (
                  <>
                      <p className="text-lg mb-4"><strong>Name:</strong> {data.name}</p>
                      <p className="text-lg mb-4"><strong>Description:</strong> {data.description}</p>
                      <p className="text-lg mb-4"><strong>Start:</strong> {startDate}</p>
                      <p className="text-lg mb-4"><strong>End:</strong> {endDate}</p>
                      <p className="text-lg mb-4"><strong>Location:</strong> {data.location}</p>
                      <p className="text-lg mb-4"><strong>Price Info:</strong> {data.price_info}</p>
                      <p className="text-lg mb-4"><strong>Organizer:</strong> {data.organizer}</p>
                      <p className="text-lg mb-4"><strong>Link:</strong> <a href={data.link} className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"><strong>Event Website</strong></a></p>
                  </>
              )
            : null}
      </div>)
}
