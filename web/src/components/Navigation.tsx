import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"
import { RootState } from "../app/store";
import { logout } from "../features/auth/auth-slice";

export const Navigation = () => {
    const isLoggedIn = useSelector((state: RootState) => state.auth.refreshToken !== null)
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const logoutAction = () => {
        dispatch(logout())
        navigate("/login")
    }

    if (isLoggedIn) {
        return <>
            <Link to='/profile'>Profile</Link>
            <button onClick={logoutAction}>Logout</button>
        </>
    }

    return <>
        <Link to='/login'></Link>
    </>
}