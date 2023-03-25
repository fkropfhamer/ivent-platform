import { useNavigate } from 'react-router-dom'
import { useChangePasswordMutation } from '../services/api'
import { useDispatch } from 'react-redux'
import type React from 'react'
import { useState } from 'react'
import { logout } from '../features/auth/auth-slice'

export const ChangePasswordForm = (): JSX.Element => {
  const navigate = useNavigate()
  const [changePassword, _] = useChangePasswordMutation()
  const dispatch = useDispatch()
  const [formState, setFormState] = useState({
    currentPassword: '',
    newPassword: ''
  })

  const submit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    await changePassword(formState).unwrap()
    dispatch(logout())

    navigate('/login')
  }

  return <form onSubmit={(e) => { void submit(e) }}>
        <label>Current Password</label>
        <input className="ml-2 border rounded-lg" type="password" onChange={(e) => { setFormState((prev) => ({ ...prev, currentPassword: e.target.value })) }
        }/>
        <label>New Password</label>
        <input className="ml-2 border rounded-lg" type="password" onChange={(e) => { setFormState((prev) => ({ ...prev, newPassword: e.target.value })) }
        }/>
        <button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 text-lg my-6" type="submit">Change Password</button>
    </form>
}
