import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setRefreshToken, setRole, setToken} from "../features/auth/auth-slice";
import {useLoginMutation} from "../services/api";

export const Login = () => {
    const navigate = useNavigate();
    const [login, {isLoading}] = useLoginMutation();
    const dispatch = useDispatch();

    const [formState, setFormState] = useState({
        username: "",
        password: "",
    });

    const [loginError, setLoginError] = useState({text: "", duration: 0});

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const loginResponse = await login(formState).unwrap();
            dispatch(setToken(loginResponse.token));
            dispatch(setRefreshToken(loginResponse["refresh-token"]));
            dispatch(setRole(loginResponse.role));
            navigate("/events");
        } catch (error) {
            setLoginError({text: "Invalid username or password. Please try again.", duration: 3000});
            setFormState((prev) => ({...prev, password: ""}))
        }

    };

    return (
        <div className="w-96 bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold mb-6">Login</h1>
            {loginError.text && (
                <p className="text-red-500 text-lg mb-4">
                    {loginError.text}
                </p>
            )}
            <form onSubmit={submit}>
                <label className="block text-lg mb-4">Username</label>
                <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-4 border-2 border-gray-300"
                    value={formState.username}
                    onChange={(e) =>
                        setFormState((prev) => ({...prev, username: e.target.value}))
                    }
                />
                <label className="block text-lg mb-4">Password</label>
                <input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-6 border-2 border-gray-300"
                    value={formState.password}
                    onChange={(e) =>
                        setFormState((prev) => ({...prev, password: e.target.value}))
                    }
                />
                <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-lg mb-6"
                >
                    Submit
                </button>
            </form>
            <p className="text-lg text-center">
                Don't have an account?{' '}
                <a href="/register" className="text-green-500 hover:underline">
                    Register
                </a>
            </p>
        </div>
    );
};
