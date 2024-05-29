import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";

function User() {
  const [user, setUser] = useState(null);  // Initialize as null
  const { userId } = useParams();  // Get userId from route parameters

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${userId}`);
        console.log(response);
        setUser(response.data.user);  // Set the user data
      } catch (e) {
        console.error("Error fetching user details:", e);
        setUser(null);  // Set user as null if there's an error
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <div>
      {user ? (
        <div>
          <h1>{user.username}</h1>
          
          {/* Add more user details as needed */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <input />
      <button>Send</button>
    </div>
  );
}

export default User;
