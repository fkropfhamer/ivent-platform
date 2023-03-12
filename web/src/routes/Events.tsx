import { Link } from "react-router-dom";
import { useFetchEventsQuery, Event } from "../services/api";
import {useEffect, useState} from "react";

export const Events = () => {
    const [page, setPage] = useState(0)
    const [events, setEvents] = useState<Event[]>([])
    const { data, isFetching } = useFetchEventsQuery(page);

    let showMore = false
    if (data) {
        showMore = data.count > events.length
    }

    useEffect(() => {
        if (!data) {
            return
        }

        if(data.events.length) {
            setEvents([...events, ...data.events]);
        } else if(page > 1) {
        }
    }, [data]);

    if (isFetching) {
        return <div>Loading</div>
    }

    return <>
        <h1>Events</h1>
        {events.map(event => <div key={event.id}><Link to={event.id}>{event.name}</Link></div>)}
        {showMore ? <button onClick={() => setPage(page + 1)}>more</button> : null}
    </>
}