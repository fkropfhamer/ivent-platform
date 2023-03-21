import {useState} from "react"
import {Link, useNavigate} from "react-router-dom";
import {useCreateUserByAdminMutation} from "../services/api";

export const CreateUser = () => {
    const [formState, setFormState] = useState({
        username: "",
        password: "",
        role: "ROLE_USER",
    });
    const [create, {error}] = useCreateUserByAdminMutation()
    const navigate = useNavigate()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log("Role: ", formState.role)

        await create({
            username: formState.username,
            password: formState.password,
            role: formState.role
        })

        navigate("/users")
    }

    return (
        <div className="w-96 bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold mb-6">Create User</h1>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <label className="block text-lg mb-4">Username</label>
                <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-6 border-2 border-gray-300"
                    value={formState.username}
                    onChange={(e) =>
                        setFormState((prev) => ({...prev, username: e.target.value}))
                    }/>
                <label className="block text-lg mb-4">Password</label>
                <input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-6 border-2 border-gray-300"
                    value={formState.password}
                    onChange={(e) =>
                        setFormState((prev) => ({...prev, password: e.target.value}))}
                />
                <label className="block text-lg mb-4">Role</label>
                <select
                    className="w-full px-4 py-2 rounded-lg text-lg mb-6 border-2 border-gray-300"
                    value={formState.role}
                    onChange={(e) =>
                        setFormState((prev) => ({ ...prev, role: e.target.value }))
                    }
                >
                    <option value="ROLE_USER">User</option>
                    <option value="ROLE_ADMIN">Admin</option>
                </select>
                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-lg mb-6"
                >
                    Create
                </button>
                <Link
                    to="/users"
                    className="w-full text-center font-medium text-gray-600 hover:text-gray-900"
                >
                    Cancel
                </Link>
            </form>
        </div>
    )
}