import { useSelector } from 'react-redux'
import { useFetchEventsQuery } from '../services/api'
import { Link } from 'react-router-dom'
import { type RootState } from '../app/store'

function Index (): JSX.Element {
  const isLoggedIn = useSelector((state: RootState) => state.auth.refreshToken !== null)
  const { data = { count: 0 }, isFetching } = useFetchEventsQuery({ page: 0, marked: undefined })

  return (
        <div className="w-96 bg-white rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold underline mb-6">Welcome to the IVENT-Platform</h1>
            <div className="card">
                <p className="text-lg text-center">
                    {isFetching ? 'Loading' : `Total number of events: ${data.count}`}
                </p>
                <div className="flex justify-center space-x-4 mt-8">
                    <Link to="/register" className="text-green-500 hover:underline">Register</Link>
                    <Link to="/login" className="text-green-500 hover:underline">Login</Link>
                    {isLoggedIn
                      ? <Link to="/events" className="text-green-500 hover:underline">Events</Link>
                      : <></>
                    }
                </div>
            </div>
        </div>

  )
}

export default Index
