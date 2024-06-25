import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const fetchUser = (user) => {
    navigate(`/${user._id}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
       
       const response = await axios.get(
        "http://localhost:3000/users",
        {
         withCredentials:true
        }
      );

        //console.log(response.data.Users);
        const u = response.data.Users || [];
        setUsers(u);
        //console.log(response)
      } catch (e) {
        console.error("Error fetching users:", e);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <div className="users">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={index}>
              <button onClick={() => fetchUser(user)}>{user.username}</button>
            </div>
          ))
        ) : (
          <div>No users found</div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
