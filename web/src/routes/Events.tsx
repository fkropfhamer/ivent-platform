import { useFetchEventsQuery } from "../services/api";

export const Events = () => {
    const { data = [], isFetching } = useFetchEventsQuery();

    if (isFetching) {
        return <div>Loading</div>
    }

    console.log(data)

    return <>{data.map(event => <div key={event.id}>{event.name}</div>)}</>
}