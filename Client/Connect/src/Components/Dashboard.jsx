import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import User from "./User";
function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [loading,setLoading]=useState(true);
  const fetchUser = (user) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        console.error("Please Sign in");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (!decodedToken) {
          navigate("/login");
          console.error("Invalid token, please Sign in");
          return;
        }

        const response = await axios.get("http://localhost:3000/users", {
          withCredentials: true,
        });

        const usersList = response.data.users || [];
        const filteredUsers = usersList.filter(
          (u) => u.username !== decodedToken.username
        );
        setUsers(filteredUsers);
        setLoading(false);
      } catch (e) {
        console.error("Error fetching users:", e);
        navigate("/login");
      }
    };

    fetchUsers();
  }, [navigate, selectedUser]);

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden ">
      <div className="w-1/6 bg-blue-500 ">
        <div className="m-2 flex justify-center">
          <input
            className="border rounded-full h-8 p-2 px-3 text-md border-blue-400 focus:outline-none focus:ring-2  focus:ring-blue"
            placeholder="Search"
          />
        </div>

        {loading?
        (<button type="button" className="bg-indigo-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50" disabled>
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4zm8-8a8 8 0 018 8h-2a6 6 0 00-6-6V4z"></path>
            </svg>
            Processing...
          </button>)
         :(users.length > 0 ? (
          users.map((user, index) => (
            <div className="flex justify-center" key={index}>
              <button onClick={() => fetchUser(user)}>{user.username}</button>
            </div>
          ))
        ) : (
          <div>No users found</div>
        ))}
      </div>
      <div className="flex w-5/6 justify-center ">
        {selectedUser ? (
          <User selectedUser={selectedUser} />
        ) : (
          <>Please select the user</>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
