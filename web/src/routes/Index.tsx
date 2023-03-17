import {useDispatch, useSelector} from 'react-redux'
import {incremented} from '../features/counter/counter-slice';
import {useFetchEventsQuery} from '../services/api';
import {Link} from 'react-router-dom';
import {RootState} from '../app/store';


function Index() {
    const isLoggedIn = useSelector((state: RootState) => state.auth.refreshToken !== null)
    const count = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch();

    const {data = {count: 0}, isFetching} = useFetchEventsQuery(0);

    console.log(data)

    return (
        <div className="w-96 bg-white rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
            <h1 className="text-3xl text-center font-bold underline mb-6">Welcome to the IVENT-Platform</h1>
            <div className="card">
                <button className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-4 text-lg mb-6"
                        onClick={() => {
                            dispatch(incremented())
                        }}>
                    Count is {count}
                </button>
                <p className="text-lg text-center">
                    {isFetching ? "Loading" : `Number of events fetched: ${data.count}`}
                </p>
                <div className="flex justify-center space-x-4 mt-8">
                    <Link to="/register" className="text-green-500 hover:underline">Register</Link>
                    <Link to="/login" className="text-green-500 hover:underline">Login</Link>
                    {isLoggedIn ?
                        <Link to="/events" className="text-green-500 hover:underline">Events</Link>
                        :
                        <></>
                    }
                </div>
            </div>
        </div>

    )
}

export default Index
