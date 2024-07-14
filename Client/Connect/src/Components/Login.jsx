import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  const Signin = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:3000/auth/login",
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      navigate("/");
    }
  };
  return (
    <div className="flex justify-center h-screen items-center">
      <div className="flex w-1/2 bg-blue-200 h-screen justify-center items-center flex-col">
        <div className="h-16 w-16 animate-bounce">
          <img src="https://cdn.pixabay.com/photo/2012/04/15/21/17/speech-35342_640.png" />
        </div>
        <div className="text-5xl  font-extrabold">Connect</div>

        <div className="font-light font-sans">Feel The Power of Connecting</div>
      </div>
      <div className="flex flex-col items-center gap-10 justify-center h-screen w-1/2 py-10  bg-blue-100">
        <div className="font-mono text-3xl text-blue-500">
          <h1>Login</h1>
        </div>

        <div className="flex flex-col space-y-4">
          <div>
            
            <input
              className="border rounded-sm h-8 p-2 border-blue-400 focus:outline-none focus:ring-2  focus:ring-blue"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            
            <input
              className="border rounded-sm h-8 p-2 border-blue-400 focus:outline-none focus:ring-2  focus:ring-blue"
              placeholder="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="border rounded-sm font-sans bg-blue-400 p-2 "
            onClick={Signin}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
