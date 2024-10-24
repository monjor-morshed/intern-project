import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    dispatch(signoutSuccess());
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          No user is logged in.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-200">
          User Profile
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left">
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Username:
                </th>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                  {currentUser.username}
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Email:
                </th>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                  {currentUser.email}
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Admin Status:
                </th>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                  {currentUser.isAdmin ? "Yes" : "No"}
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Blocked:
                </th>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                  {currentUser.isBlocked ? "Yes" : "No"}
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Created Templates:
                </th>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                  {currentUser.createdTemplates?.length || 0}
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Filled Forms:
                </th>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                  {currentUser.filledForms?.length || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
