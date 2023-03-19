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

    return (
        <div className="w-full bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold mb-6">Users</h1>
            {users.map(user => (
                <div key={user.id} className="py-1 my-5 bg-gray-200 rounded-lg border border-gray-300">
                    <div className="px-4 py-2 flex justify-between items-center">
                        <div className="font-bold text-lg">{user.name}</div>
                        <div className="text-sm font-medium text-gray-500">{user.role}</div>
                    </div>
                    <div className="px-4 py-2 text-gray-600 text-sm">{`ID: ${user.id}`}</div>
                </div>
            ))}
        </div>
    )
}