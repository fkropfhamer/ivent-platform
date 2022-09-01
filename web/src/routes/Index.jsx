import reactLogo from '../assets/react.svg'
import { useDispatch, useSelector } from 'react-redux'
import { incremented } from '../features/counter/counter-slice';
import { useFetchEventsQuery } from '../features/events/events-api-slice';
import { Link } from 'react-router-dom';


function Index() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const { data = [], isFetching } = useFetchEventsQuery();

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => { dispatch(incremented()) }}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <p>
          {isFetching ? "loading" : `Number of events fetched ${data.length}`} 
        </p>
        <Link to="/register">register</Link>
        <Link to="/login">login</Link>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default Index
