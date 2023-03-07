import { useProfileQuery } from "../services/api"

export const Profile = () => {
    const { data: profile, error, isLoading } = useProfileQuery();

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    if (error && 'data' in error) {
        return <h1>{error.status} {JSON.stringify(error.data)}</h1>
    }

    return <>
        <h1>Profile</h1>
        <ul>
            <li>Username: {profile?.username}</li>
            <li>Id: { profile?.id }</li>
        </ul>

    </>
}
