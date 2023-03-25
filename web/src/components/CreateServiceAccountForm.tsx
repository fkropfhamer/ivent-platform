import type React from 'react'
import { useState } from 'react'
import { useCreateServiceAccountMutation } from '../services/api'

export const CreateServiceAccountForm = (): JSX.Element => {
  const [name, setName] = useState('')
  const [token, setToken] = useState('')
  const [createServiceAccount, _] = useCreateServiceAccountMutation()

  const submit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    try {
      setToken('')
      const { token } = await createServiceAccount({ name }).unwrap()
      setName('')
      setToken(token)
    } catch (e) {
      console.log(e)
    }
  }

  return <div>
        { token !== '' ? token : null}
        <form onSubmit={(e) => { void submit(e) }}>
            name:
            <input value={name} onChange={(e) => { setName(e.target.value) }}/>
            <button type="submit">create</button>
        </form>
    </div>
}
