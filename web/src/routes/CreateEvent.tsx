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

    return <>
        <h1>Create Event</h1>
        <form onSubmit={handleSubmit}>
            <label>
                Name
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </label>

            <button type="submit">create</button>
        </form>
    </>
}