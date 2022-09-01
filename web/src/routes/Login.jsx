import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { setToken } from "../features/auth/auth-slice";
import { useLoginMutation } from "../services/api";




export const Login = () => {
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();

    const [formState, setFormState] = useState({
        username: '',
        password: '',
    });

    const onFormSubmit = async () => {
        const token = await login(formState).unwrap();
        dispatch(setToken(token))

        console.log(token);
        //navigate("/login")
    }


    return (
        <>
            <h1>Login</h1>
            <input type='text' value={formState.username} onChange={(e) => setFormState((prev) => ({ ...prev, username: e.target.value }))} />
            <input type='text' value={formState.password} onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))} />
            <button onClick={onFormSubmit}>Submit</button>
        </>
    )
}