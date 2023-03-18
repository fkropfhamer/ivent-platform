import {useEffect, useState} from "react";
import {useFetchEventsQuery, useFetchUsersQuery, User} from "../services/api";

export const Users = () => {
    const [page, setPage] = useState(0)
    const [users, setUsers] = useState<User[]>([])
    const {data, isFetching} = useFetchUsersQuery(page);

    useEffect(() => {
        if (!data) {
            return
        }

        if (data.users.length) {
            setUsers([...users, ...data.users]);

            console.log(data.users)
        } else if (page > 1) {
        }
    }, [data]);

    if (isFetching) {
        return <div>Loading</div>
    }

    return <>
        <h1>Users</h1>
        {users.map(user => <div key={user.id}>
            <div>id: {user.id}</div>
            <div>username: {user.name}</div>
            <div>role: {user.role}</div>
        </div>)}
    </>
}