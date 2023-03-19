import './App.css'
import {Outlet, useNavigate} from 'react-router-dom';
import { Navigation } from './components/Navigation';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./app/store";
import {hasRedirectedToLogin} from "./features/auth/auth-slice";
import {useEffect} from "react";


function App() {
    const redirectLogout = useSelector((state: RootState) => state.auth.willRedirectToLogin)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (redirectLogout) {
            dispatch(hasRedirectedToLogin())
            navigate("/login")
        }
    }, [redirectLogout])



function App (): JSX.Element {
  return (
    <div className="App">
      <Navigation />
      <Outlet />
    </div>
  )
}

export default App
