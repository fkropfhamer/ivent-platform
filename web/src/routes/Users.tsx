import { useEffect, useState } from 'react'
import {
  useChangeUserRoleByAdminMutation,
  useDeleteUserByAdminMutation,
  useFetchUsersQuery,
  type User
} from '../services/api'
import { Link } from 'react-router-dom'
import UserRole from '../constants/roles'

export const Users = (): JSX.Element => {
  const [page, _setPage] = useState(0)
  const [users, setUsers] = useState<User[]>([])
  const { data, isFetching } = useFetchUsersQuery({ page, role: undefined })
  const [deleteUserByAdmin, _] = useDeleteUserByAdminMutation()
  const [changeUserRoleByAdmin, __] = useChangeUserRoleByAdminMutation()

  useEffect(() => {
    if (data == null) {
      return
    }

    if (data.users.length > 0) {
      setUsers([...users, ...data.users])

      console.log(data.users)
    }
  }, [data])

  if (isFetching) {
    return <div>Loading</div>
  }

  const handleRoleChange = async (id: string, newRole: string): Promise<void> => {
    await changeUserRoleByAdmin({
      id,
      newRole
    })
  }

  const handleDeleteUser = async (id: string): Promise<void> => {
    await deleteUserByAdmin(id)
  }

  return (
        <div className="w-full bg-gray-100 rounded-lg mx-auto my-20 p-8 border-2 border-gray-200 relative">
            <h1 className="text-3xl text-center font-bold mb-6">Users</h1>
            <div className="relative top-0 md:absolute md:top-8 right-4 mt-2 mr-4">
                <Link to="/users/create"
                      className="text-white bg-green-500 hover:bg-green-600 rounded-lg py-2 px-4 text-lg">Create
                    User</Link>
            </div>
            {users.map(user => (
                <div key={user.id} className="py-1 my-5 bg-gray-200 rounded-lg border border-gray-300">
                    <div className="px-4 py-2 flex justify-between items-center">
                        <div className="font-bold text-lg">{user.name}</div>
                        <div className="text-sm font-medium text-gray-500">{user.role}</div>
                    </div>
                    <div className="px-4 py-2 text-gray-600 text-sm">{`ID: ${user.id}`}</div>
                    <div className="px-4 py-2 flex justify-end">
                        <button
                            className="text-red-500 hover:text-red-700 font-medium mr-4"
                            onClick={() => { void handleDeleteUser(user.id) }}>
                            Delete
                        </button>
                        <select
                            className="border border-gray-300 rounded-md px-3 py-1"
                            value={user.role}
                            onChange={(e) => { void handleRoleChange(user.id, e.target.value) }}>
                            <option value={`${UserRole.ROLE_USER}`}>User</option>
                            <option value={`${UserRole.ROLE_ADMIN}`}>Admin</option>
                        </select>
                    </div>
                </div>
            ))}
            <style>
                {`
      @media screen and (max-width: 640px) {
        .relative {
          position: relative;
          top: 0;
          right: 0;
          margin: 0 auto;
          text-align: center;
        }
      `}
            </style>
        </div>
  )
}
