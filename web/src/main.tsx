import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import { store } from './app/store'
import './index.css'
import Index from './routes/Index'
import { Login } from './routes/Login'
import { Register } from './routes/Register'
import { Profile } from './routes/Profile'
import { Events } from './routes/Events'
import { Event } from './routes/Event'
import { CreateEvent } from './routes/CreateEvent'
import {Users} from "./routes/Users";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='profile' element={<Profile />} />
            <Route path='events/:id' element={<Event />} />
            <Route path='events/create' element={<CreateEvent />} />
            <Route path='events' element={<Events />} />
            <Route path='users' element={<Users />} />
            <Route index element={<Index />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
