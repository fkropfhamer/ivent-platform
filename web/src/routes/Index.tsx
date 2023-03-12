import { useDispatch, useSelector } from 'react-redux'
import { incremented } from '../features/counter/counter-slice';
import { useFetchEventsQuery } from '../services/api';
import { Link } from 'react-router-dom';
import { RootState } from '../app/store';


function Index() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  const { data = { count: 0 }, isFetching } = useFetchEventsQuery(0);

  console.log(data)

  return (
    <div className="App">
      <h1 className='text-3xl font-bold underline'>Hallo Welt</h1>
      <div className="card">
        <button onClick={() => { dispatch(incremented()) }}>
          count is {count}
        </button>
        <p>
          {isFetching ? "loading" : `Number of events fetched ${data.count}`}
        </p>
        <Link to="/register">register</Link>
        <Link to="/login">login</Link>
      </div>
    </div>
  )
}

export default Index
