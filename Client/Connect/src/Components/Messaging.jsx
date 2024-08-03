import Dashboard from "./Dashboard";
import User from "./User";
import { useParams } from "react-router-dom";
function Messaging() {
  const {userId}=useParams();
 
  return (
    <div className="flex h-full w-full">
    <div className="flex h-full w-1/6">
    <Dashboard />
    </div>
     
       <div className="flex w-full justify-center items-center">
        
          <User selectedUser={userId} />
        
      </div> 
    </div>
  );
}

export default Messaging;
