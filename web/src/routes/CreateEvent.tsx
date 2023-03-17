import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useCreateEventMutation } from "../services/api";

export const CreateEvent = () => {
    const [name, setName] = useState("")
    const [create, _] = useCreateEventMutation()
    const navigate = useNavigate()
    const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await create({ name })

        navigate("/events")
    }

    return (
        <div className="w-96 bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold mb-6">Create Event</h1>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <label className="block text-lg mb-4">
                    Name
                </label>
                <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-6 border-2 border-gray-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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