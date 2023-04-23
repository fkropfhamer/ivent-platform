import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { type RootState } from '../app/store'
import { logout } from '../features/auth/auth-slice'

export const Navigation = (): JSX.Element => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.refreshToken !== null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logoutAction = (): void => {
    dispatch(logout())
    navigate('/login')
  }

  return (
        <nav className="flex justify-between items-center py-4">
            <div className="flex items-center">
                <Link to="/" className="text-xl font-bold py-2">
                    IVENT-Plattform
                </Link>
            </div>
            <div className="flex items-center">
            <Link to="/about" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">
                About
            </Link>
                {isLoggedIn
                  ? (
                    <>
                        <Link to="/profile" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
                            Profile
                        </Link>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            onClick={logoutAction}
                        >
                            Logout
                        </button>
                    </>
                    )
                  : (
                    <Link
                        to="/login"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Login
                    </Link>
                    )}
            </div>
        </nav>
  )
}
