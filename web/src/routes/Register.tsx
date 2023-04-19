import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterUserMutation } from '../services/api'

export const Register = (): JSX.Element => {
  const navigate = useNavigate()
  const [registerError, setRegisterError] = useState("")

  const [register, _] = useRegisterUserMutation()

  const [formState, setFormState] = useState({
    username: '',
    password: ''
  })

  const submit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    try {
        await register(formState).unwrap()
        navigate('/login')
    } catch(error) {
        setRegisterError((error as any).data.message)
    }
  }

  return (
        <div className="w-96 bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold mb-6">Register</h1>
            {(registerError !== '') && (
                <p className="text-red-500 text-lg mb-4">
                    {registerError}
                </p>
            )}
            <form onSubmit={(e) => { void submit(e) }}>
                <label className="block text-lg mb-4">Username</label>
                <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-4 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formState.username}
                    onChange={(e) => { setFormState((prev) => ({ ...prev, username: e.target.value })) }}
                />
                <label className="block text-lg mb-4">Password</label>
                <input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg text-lg mb-6 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formState.password}
                    onChange={(e) => { setFormState((prev) => ({ ...prev, password: e.target.value })) }}
                />
                <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 text-lg mb-6 focus:outline-none" type='submit'
                >
                    Submit
                </button>
            </form>
            <p className="text-lg text-center">
                Already signed up?{' '}
                <Link to="/login" className="text-green-500 hover:underline">
                    Login
                </Link>
            </p>
        </div>
  )
}
