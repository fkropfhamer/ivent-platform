import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useLoginMutation } from "../features/auth/auth-api-slice";




export const Login = () => {
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const [formState, setFormState] = useState({
        username: '',
        password: '',
    });

    const onFormSubmit = async () => {
        const token = await login(formState).unwrap();

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