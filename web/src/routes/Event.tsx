import { useParams } from "react-router-dom"
import { useEventQuery } from "../services/api"

type EventParams = {
    id: string
}

export const Event = () => {
    const { id } = useParams<{ id: string }>()
    if (!id) {
        return <>
            <h1>Eventid not found 😔</h1>
        </>
    }
    const { data, isFetching } = useEventQuery(id)    
    

    return <>
        <h1>Event</h1>
        <p>{id}</p>
        {data ? <>
        <p>Name: {data.name}</p>
        </>: null}

    </>
}