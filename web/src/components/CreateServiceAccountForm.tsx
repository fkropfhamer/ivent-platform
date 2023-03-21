import React, {useState} from "react";
import {useCreateServiceAccountMutation} from "../services/api";

export const CreateServiceAccountForm = () => {
    const [name, setName] = useState("")
    const [token, setToken] = useState("")
    const [createServiceAccount, _] = useCreateServiceAccountMutation();


    const submit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setToken("")
            const { token } =await createServiceAccount({name}).unwrap()
            setName("")
            setToken(token)
        } catch (e) {
            console.log(e)
        }
    }

    return <div>
        { token !== "" ? token : null}
        <form onSubmit={submit}>
            name:
            <input value={name} onChange={(e) => setName(e.target.value)}/>
            <button type="submit">create</button>
        </form>
    </div>
}