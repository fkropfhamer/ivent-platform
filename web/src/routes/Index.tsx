import { useSelector } from 'react-redux'
import { useFetchEventsQuery } from '../services/api'
import { Link } from 'react-router-dom'
import { type RootState } from '../app/store'

function Index (): JSX.Element {
  const isLoggedIn = useSelector((state: RootState) => state.auth.refreshToken !== null)
  const { data = { count: 0 }, isFetching } = useFetchEventsQuery({ page: 0, marked: undefined })

  return (
        <div className="w-96 bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold mb-6">Welcome to the IVENT-Platform</h1>
            <div className="card">
                <p className="text-lg text-center">
                    {isFetching ? 'Loading' : (
                        <>
                            Home of <span className="text-green-500 font-bold">{data.count}</span> events and counting
                        </>
                    )}
                </p>
                <div className="flex justify-center space-x-4 mt-8">
                    <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 transition-colors duration-300">Register</Link>
                    <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 transition-colors duration-300">Login</Link>
                    {isLoggedIn ? (
                        <Link to="/events" className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-4 transition-colors duration-300">
                            Events
                        </Link>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>

  )
}

export default Index
