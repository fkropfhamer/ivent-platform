import { useFetchEventsQuery } from "../services/api";

export const Events = () => {
    const { data = [], isFetching } = useFetchEventsQuery();

    if (isFetching) {
        return <div>Loading</div>
    }

    console.log(data)

    return <>
        <h1>Events</h1>
        {data.map(event => <div key={event.id}>{event.name}</div>)}
    </>
}