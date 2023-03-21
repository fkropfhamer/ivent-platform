import {Link, useNavigate} from "react-router-dom";
import {useDeleteAccountMutation, useProfileQuery} from "../services/api"
import {useDispatch, useSelector} from "react-redux";
import {logout, Role} from "../features/auth/auth-slice";
import {ChangePasswordForm} from "../components/ChangePasswordForm";
import {RootState} from "../app/store";
import {CreateServiceAccountForm} from "../components/CreateServiceAccountForm";

export const Profile = () => {
    const {data: profile, error, isLoading} = useProfileQuery();
    const navigate = useNavigate();
    const [deleteAcc, _] = useDeleteAccountMutation();
    const dispatch = useDispatch();
    const role = useSelector((state: RootState) => state.auth.role)

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

    return (
        <div className="w-96 bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold mb-6">Profile</h1>
            <ul className="mb-6">
                <li className="text-lg mb-2">
                    <span className="font-bold">Username:</span> {profile?.username}
                </li>
                <li className="text-lg mb-2">
                    <span className="font-bold">Id:</span> {profile?.id}
                </li>
            </ul>
            <div className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-lg mb-2" >
                <Link to="/events/create"> Create Event </Link>
            </div>
            <div className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-lg mb-20" >
                <Link to="/events"> GoTo Events </Link>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Change Password</h2>
                <ChangePasswordForm/>
            </div>
            <h2 className="text-xl font-bold mb-2">Account Deletion</h2>
            <button
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 text-lg mb-6"
                onClick={deleteAccount}
            >
                Delete Account
            </button>
            <h2 className="text-xl font-bold mb-2 mt-8">Admin Tools</h2>
            { role === Role.Admin ? <div className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-lg mb-5" >
                <Link to={"/users"}>Manage Accounts</Link>
            </div>: null}
            <CreateServiceAccountForm />
        </div>
    )
}
