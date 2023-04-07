import './App.css'
import { Outlet, useNavigate } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { useDispatch, useSelector } from 'react-redux'
import { type RootState } from './app/store'
import { hasRedirectedToLogin, setToken, unAuthenticate } from './features/auth/auth-slice'
import { useEffect, useState } from 'react'
import { useGetRefreshTokenQuery } from './services/api'

function App (): JSX.Element {
  const redirectLogout = useSelector((state: RootState) => state.auth.willRedirectToLogin)
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken)
  const [isLogInStatusChecked, setIsLogInStatusChecked] = useState(refreshToken === null)
  const { data, isLoading, error } = useGetRefreshTokenQuery(refreshToken as string, { skip: refreshToken === null })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (redirectLogout) {
      dispatch(hasRedirectedToLogin())
      navigate('/login')
    }
  }, [redirectLogout])

  useEffect(() => {
    if ((data?.token) != null) {
      dispatch(setToken(data?.token))
      setIsLogInStatusChecked(true)
    }

    if (error != null) {
      dispatch(unAuthenticate())
      setIsLogInStatusChecked(true)
    }
  }, [data, error])

  if (!isLogInStatusChecked) {
    return <div>checking</div>
  }

  if (isLoading) {
    return <div>Loading</div>
  }

  return (
    <div className="App">
      <Navigation />
      <Outlet />
    </div>
  )
}

export default App
