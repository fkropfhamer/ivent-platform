import {Link} from "react-router-dom";
import {Event, useFetchEventsQuery} from "../services/api";
import {useEffect, useState} from "react";

export const Events = () => {
    const [page, setPage] = useState(0)
    const [events, setEvents] = useState<Event[]>([])
    const {data, isFetching} = useFetchEventsQuery(page);

    let showMore = false
    if (data) {
        showMore = data.count > events.length
    }

    useEffect(() => {
        if (!data) {
            return
        }

        if (data.events.length) {
            setEvents([...events, ...data.events]);
        } else if (page > 1) {
        }
    }, [data]);

    if (isFetching) {
        return <div>Loading</div>
    }

    return (
        <div className="w-full bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold mb-6">Events</h1>
            {events.map(event => (
                <div key={event.id}
                     className="h-52 py-1 my-5 bg-gray-200 rounded-lg text-center border border-gray-300 flex justify-center items-center">
                    <Link to={event.id} className="text-green-500 hover:underline p-2">
                        {event.name}
                    </Link>
                </div>
            ))}
            {showMore ? (
                <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-lg mb-6"
                    onClick={() => setPage(page + 1)}
                >
                    more
                </button>
            ) : null}
        </div>
    );
}