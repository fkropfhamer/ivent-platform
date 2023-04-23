import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateEventMutation } from '../services/api'

export const CreateEvent = (): JSX.Element => {
  const [formState, setFormState] = useState({
    name: '',
    date: '',
    location: '',
    priceInfo: '',
    organizer: '',
    link: ''
  })
  const [create, _unused] = useCreateEventMutation()
  const navigate = useNavigate()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    await create({
      name: formState.name,
      date: formState.date,
      location: formState.location,
      price_info: formState.priceInfo,
      organizer: formState.organizer,
      link: formState.link
    })

    navigate('/events')
  }

  return (
        <div className="w-96 bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold mb-6">Create Event</h1>
            <form onSubmit={(e) => {
              void handleSubmit(e)
            }} className="flex flex-col">
                <label className="block text-lg mb-4">
                    Name *
                </label>
                <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-6 border-2 border-gray-300"
                    value={formState.name}
                    onChange={(e) => {
                      setFormState((prev) => ({ ...prev, name: e.target.value }))
                    }}
                    required
                />
                <label className="block text-lg mb-4">
                    Date *
                </label>
                <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-6 border-2 border-gray-300"
                    value={formState.date}
                    onChange={(e) => {
                      setFormState((prev) => ({ ...prev, date: e.target.value }))
                    }}
                    required
                />
                <label className="block text-lg mb-4">
                    Location
                </label>
                <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-6 border-2 border-gray-300"
                    value={formState.location}
                    onChange={(e) => {
                      setFormState((prev) => ({ ...prev, location: e.target.value }))
                    }}
                />
                <label className="block text-lg mb-4">
                    Price Info
                </label>
                <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-6 border-2 border-gray-300"
                    value={formState.priceInfo}
                    onChange={(e) => {
                      setFormState((prev) => ({ ...prev, priceInfo: e.target.value }))
                    }}
                />
                <label className="block text-lg mb-4">
                    Organizer
                </label>
                <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-6 border-2 border-gray-300"
                    value={formState.organizer}
                    onChange={(e) => {
                      setFormState((prev) => ({ ...prev, organizer: e.target.value }))
                    }}
                />
                <label className="block text-lg mb-4">
                    Link
                </label>
                <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-6 border-2 border-gray-300"
                    value={formState.link}
                    onChange={(e) => {
                      setFormState((prev) => ({ ...prev, link: e.target.value }))
                    }}
                />
                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-lg mb-6"
                >
                    Create
                </button>
            </form>
        </div>
  )
}
