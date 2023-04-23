import { useNavigate } from 'react-router-dom'
import { useChangePasswordMutation } from '../services/api'
import { useDispatch } from 'react-redux'
import type React from 'react'
import { useState } from 'react'
import { logout } from '../features/auth/auth-slice'
import { validatePassword } from '../services/validation'

const initFormState = {
  currentPassword: '',
  newPassword: ''
}

export const ChangePasswordForm = (): JSX.Element => {
  const navigate = useNavigate()
  const [changePassword, _] = useChangePasswordMutation()
  const dispatch = useDispatch()
  const [formErrors, setFormErrors] = useState(initFormState)
  const [formState, setFormState] = useState({
    currentPassword: '',
    newPassword: '',
    repeatedNewPassword: ''
  })

  const submit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setFormErrors(initFormState)

    if (formState.currentPassword === '') {
      setFormErrors({ ...formErrors, currentPassword: 'can not be empty' })

      return
    }

    if (formState.newPassword === '') {
      setFormErrors({ ...formErrors, newPassword: 'can not be empty' })

      return
    }

    const passwordErr = validatePassword(formState.newPassword)
    if (passwordErr.hasErrors) {
      const errors = [passwordErr.length, passwordErr.numberCount, passwordErr.specialCharCount].reduce<string[]>((p, c) => {
        if (c !== null) {
          return [...p, c]
        }

        return p
      }, [])
      setFormErrors({ ...formErrors, newPassword: errors.join(', ') })
      return
    }

    if (formState.newPassword !== formState.repeatedNewPassword) {
      return
    }

    try {
      await changePassword(formState).unwrap()
      dispatch(logout())
      navigate('/login')
    } catch (error) {
      setFormErrors({ ...formErrors, currentPassword: (error as any).data.message })
    }
  }

  return (
    <form onSubmit={(e) => { void submit(e) }}>
      <label>Current Password</label>
      <input className="ml-2 border rounded-lg" type="password" onChange={(e) => { setFormState((prev) => ({ ...prev, currentPassword: e.target.value })) }} />
      {formErrors.currentPassword !== '' ? formErrors.currentPassword : null}
      <label>New Password</label>
      <input className="ml-2 border rounded-lg" type="password" onChange={(e) => { setFormState((prev) => ({ ...prev, newPassword: e.target.value })) }} />
      {formErrors.newPassword !== '' ? formErrors.newPassword : null }
      <label>Repeat New Password</label>
      <input className="ml-2 border rounded-lg" type="password" onChange={(e) => { setFormState(prev => ({ ...prev, repeatedNewPassword: e.target.value })) }} />
      {formState.newPassword !== formState.repeatedNewPassword ? 'password do not match' : null}
      <button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 text-lg my-6" type="submit">Change Password</button>
    </form>
  )
}
