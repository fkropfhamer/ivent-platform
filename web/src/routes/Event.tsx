import { useParams } from 'react-router-dom'
import { useEventQuery } from '../services/api'

export const Event = (): JSX.Element => {
  const { id } = useParams<{ id: string }>()
  if (id == null) {
    return <>
            <h1>Eventid not found 😔</h1>
        </>
  }
  const { data } = useEventQuery(id)

  return (
        <div className="w-96 bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold mb-6">Event</h1>
            <p className="text-lg mb-4">{id}</p>
            {(data != null)
              ? (
                <>
                    <p className="text-lg mb-4">Name: {data.name}</p>
                </>
                )
              : null}
        </div>)
}
