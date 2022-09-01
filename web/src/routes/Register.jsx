import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useRegisterUserMutation } from "../features/users/users-api-slice";




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
        <>
            <h1>Register</h1>
            <input type='text' value={formState.username} onChange={(e) => setFormState((prev) => ({ ...prev, username: e.target.value}))} />
            <input type='text' value={formState.password} onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value}))} />
            <button onClick={onFormSubmit}>Submit</button>
        </>
    )
}
