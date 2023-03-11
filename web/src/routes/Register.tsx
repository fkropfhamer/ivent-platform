import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useRegisterUserMutation } from "../services/api";
import styles from '../styles/login.module.css'



export const Register = () => {
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterUserMutation();

    const [formState, setFormState] = useState({
        username: '',
        password: '',
    });

    const onFormSubmit = async () => {
        await register(formState);
        navigate("/login")
    }


    return (
        <body>
        <div className={styles["login-box"]}>
            <h1 className={styles.h1}>Register</h1>
            <form>
                <label>Username</label>
                <input
                    type='text'
                    value={formState.username}
                    onChange={(e) => setFormState((prev) => ({ ...prev, username: e.target.value}))}
                />
                <label>Password</label>
                <input
                    type='text'
                    value={formState.password}
                    onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value}))}
                />
            </form>
            <button onClick={onFormSubmit}>Submit</button>
            <p>
                Have already an account? <a href="/login">Login</a>
            </p>
        </div>
        </body>
    )
}
