import { useFetchEventsQuery } from '../services/api'
import { useState } from 'react'
import { EventList } from '../components/EventList'
import { useSelector } from 'react-redux'
import { type RootState } from '../app/store'

interface Filters {
  isMarked: boolean
}

const EventsListPage = ({ page, filters }: { page: number, filters: Filters }): JSX.Element => {
  const { data, isFetching } = useFetchEventsQuery({ page, marked: filters.isMarked ? '1' : undefined })

  if (isFetching) {
    return <div>Loading</div>
  }

  if (data == null) {
    return <div>Error</div>
  }

  return (
    <EventList events={data.events} />
  )
}

export const Events = (): JSX.Element => {
  const [markedFilter, setMarkedFilter] = useState(false)
  const filters = { isMarked: markedFilter }
  const [pages, setPages] = useState<JSX.Element[]>([<EventsListPage page={0} filters={filters} key={1}/>])
  const [page, setPage] = useState(0)
  const { data, isFetching } = useFetchEventsQuery({ page: 0, marked: markedFilter ? '1' : undefined })
  const isLoggedIn = useSelector((state: RootState) => state.auth.refreshToken !== null)

  if (isFetching) {
    return <div>Loading</div>
  }

  if (data == null) {
    return <div>Error</div>
  }

  const total = data.count

  const moreAvailable = total > (page + 1) * 15
  const setFilter = async (): Promise<void> => {
    setMarkedFilter(!markedFilter)
    const filters = { isMarked: !markedFilter }
    setPages([<EventsListPage page={0} filters={filters} key={1}/>])
  }

  const loadMore = (): void => {
    const nextPage = page + 1
    setPage(nextPage)
    setPages([...pages, <EventsListPage page={nextPage} filters={filters} key={nextPage}/>])
  }

  return (
    <div className="w-full bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200">
      <h1 className="text-3xl text-center font-bold mb-6">Events</h1>
      {isLoggedIn
        ? (<>marked<input
          type="checkbox"
          checked={markedFilter}
          onChange={() => { void setFilter() }}
        /></>)
        : null}
      { pages }
      {moreAvailable ? <button onClick={() => { loadMore() }}>more</button> : null}
    </div>
  )
}
