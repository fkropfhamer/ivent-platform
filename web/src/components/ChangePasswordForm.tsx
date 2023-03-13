import {useNavigate} from "react-router-dom";
import {useChangePasswordMutation} from "../services/api";
import {useDispatch} from "react-redux";
import React, {useState} from "react";
import {logout} from "../features/auth/auth-slice";

export const ChangePasswordForm = () => {
    const navigate = useNavigate();
    const [changePassword, _] = useChangePasswordMutation();
    const dispatch = useDispatch();
    const [formState, setFormState] = useState({
        currentPassword: "",
        newPassword: "",
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()

        await changePassword(formState).unwrap()
        dispatch(logout())

        navigate("/login")
    }

    return <form onSubmit={submit}>
        <label>Current Password</label>
        <input type="password" onChange={(e) =>
            setFormState((prev) => ({...prev, currentPassword: e.target.value}))
        }/>
        <label>New Password</label>
        <input type="password" onChange={(e) =>
            setFormState((prev) => ({...prev, newPassword: e.target.value}))
        }/>
        <button type="submit">Change Password</button>
    </form>
}