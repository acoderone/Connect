import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const fetchUser = (user) => {
    navigate(`/${user._id}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        console.error("Please Sign in");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (!decodedToken) {
          navigate('/login');
          console.error("Invalid token, please Sign in");
          return;
        }

        const response = await axios.get("http://localhost:3000/users", {
          withCredentials: true
        });

        const usersList = response.data.users || [];
        const filteredUsers = usersList.filter((u) => u.username !== decodedToken.username);
        setUsers(filteredUsers);
      } catch (e) {
        console.error("Error fetching users:", e);
        navigate('/login');
      }
    };

    fetchUsers();
  }, [navigate]);

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
