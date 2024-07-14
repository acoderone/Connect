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
      try {
       
       const response = await axios.get(
        "http://localhost:3000/users",
        {
         withCredentials:true
        }
      );
         const token=localStorage.getItem('token');
         if(token){
          const decodedToken=jwtDecode(token);
          if(decodedToken){
            const u = response.data.users || [];
            const ls=u.filter((u)=>u.username!=decodedToken.username);
            setUsers(ls);
          }
          else{
            console.error("Please Sign in")
          }
         
         }
         
        
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
