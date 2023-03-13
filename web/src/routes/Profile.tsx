import {Link, useNavigate} from "react-router-dom";
import {useDeleteAccountMutation, useLoginMutation, useProfileQuery} from "../services/api"
import {useDispatch} from "react-redux";
import {logout} from "../features/auth/auth-slice";
import {ChangePasswordForm} from "../components/ChangePasswordForm";

export const Profile = () => {
    const { data: profile, error, isLoading } = useProfileQuery();
    const navigate = useNavigate();
    const [deleteAcc, _] = useDeleteAccountMutation();
    const dispatch = useDispatch();

    const deleteAccount = async () => {
        await deleteAcc().unwrap()
        dispatch(logout())

        navigate("/")
    }

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
        <ChangePasswordForm />
        <button onClick={deleteAccount}>Delete Account</button>
        <Link to="/events/create">create Event</Link>
    </>
}
