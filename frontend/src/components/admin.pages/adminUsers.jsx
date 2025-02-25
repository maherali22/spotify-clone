import React , { useEffect } from "react";
import { useDispatch , useSelector } from "react-redux";
import { getAllusers } from "../../redux/slice/admin/adminUserSlice";
import AdminNavbar from "./adminNavbar";
import AdminSidebar from "./adminSidebar";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.allusers.allusers);

  useEffect(() => {
      dispatch(getAllusers());
  }, [dispatch]);

  console.log(users);

  return (
      <div className='flex flex-col fixed w-screen h-screen bg-black'>
        <AdminNavbar/>

          <div className='flex flex-1 w-full'>
              <AdminSidebar />
              <div className="bg-black text-white p-4 w-full overflow-hidden">
                  <h1 className="text-2xl font-bold mb-4">Users</h1>
                  <div className="h-[calc(100vh-64px)] overflow-y-scroll">
                      {users && users.length > 0 ? (
                          <div className="overflow-x-auto mb-40">
                              <table className="min-w-full bg-gray-800 border border-gray-700">
                                  <thead>
                                      <tr>
                                          <th className="border-b border-gray-700 px-4 py-2 text-center">Name</th>
                                          <th className="border-b border-gray-700 px-4 py-2 text-center">Email</th>
                                          <th className="border-b border-gray-700 px-4 py-2 text-center">Verification</th>
                                          <th className="border-b border-gray-700 px-4 py-2 text-center">Actions</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {users.map((user) => (
                                          <tr key={user._id} className="hover:bg-gray-700">
                                              <td className="border-b border-gray-600 px-4 py-2 text-center">{user.name}</td>
                                              <td className="border-b border-gray-600 px-4 py-2 text-center">{user.email}</td>
                                              <td className="border-b border-gray-600 px-4 py-2 text-center">{user.isVerified ? 'Yes' : 'No'}</td>
                                              <td className="border-b border-gray-600 px-4 py-2 text-center">
                                                  <Link to={`/admin/userprofile/${user._id}`}>
                                                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                                      View Details
                                                  </button>
                                                  </Link>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      ) : (
                          <p>No users found.</p>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );
};

export default AdminUsers;
