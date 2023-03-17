import {useParams} from "react-router-dom"
import {useEventQuery} from "../services/api"

type EventParams = {
    id: string
}

export const Event = () => {
    const {id} = useParams<{ id: string }>()
    if (!id) {
        return <>
            <h1>Eventid not found 😔</h1>
        </>
    }
    const {data, isFetching} = useEventQuery(id)


    return (
        <div className="w-96 bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold mb-6">Event</h1>
            <p className="text-lg mb-4">{id}</p>
            {data ? (
                <>
                    <p className="text-lg mb-4">Name: {data.name}</p>
                </>
            ) : null}
        </div>);

}