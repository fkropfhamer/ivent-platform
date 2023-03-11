import {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom"
import {setRefreshToken, setToken} from "../features/auth/auth-slice";
import {useLoginMutation} from "../services/api";
import styles from '../styles/login.module.css'

export const Login = () => {
    const navigate = useNavigate();
    const [login, {isLoading}] = useLoginMutation();
    const dispatch = useDispatch();

    const [formState, setFormState] = useState({
        username: '',
        password: '',
    });

    const onFormSubmit = async () => {
        const tokens = await login(formState).unwrap();
        dispatch(setToken(tokens.token))
        dispatch(setRefreshToken(tokens["refresh-token"]))

        console.log(tokens);

        navigate("/profile")
    }


    return (
        <body>
        <div className={styles["login-box"]}>
            <h1 className={styles.h1}>Login</h1>
            <form>
                <label>Username</label>
                <input
                    type='text'
                    value={formState.username}
                    onChange={(e) => setFormState((prev) => ({...prev, username: e.target.value}))}
                />
                <label>Password</label>
                <input
                    type='text'
                    value={formState.password}
                    onChange={(e) => setFormState((prev) => ({...prev, password: e.target.value}))}
                />
            </form>
            <button
                onClick={onFormSubmit}>Submit</button>
            <p>
                Don't have an account? <a href="/register">Register</a>
            </p>
        </div>
        </body>
    )
}