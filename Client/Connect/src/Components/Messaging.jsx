import { useState } from "react";
import Dashboard from "./Dashboard";
import User from "./User";
import { useParams } from "react-router-dom";
function Messaging() {
  const {userId}=useParams();
  const [highlighted,setHighlighted]=useState(null);
 
  return (
    <div className="flex h-full w-full">
    <div className="flex h-full w-1/6">
    <Dashboard highlightedUser={highlighted}/>
  
    </div>
     
       <div className="flex w-full justify-center items-center">
        
          <User selectedUser={userId} setHighlighted={setHighlighted}/>
        
      </div> 
    </div>
  );
}

export default Messaging;
