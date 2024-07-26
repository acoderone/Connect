import Dashboard from './Dashboard'
import User from './User';

function Messaging() {
    
   
  return (
    <div>
      <Dashboard />
      <div className="flex overflow-y-auto  justify-center ">
        {selectedUser ? (
          <User selectedUser={selectedUser} />
        ) : (
          <>Please select the user</>
        )}
      </div>
    </div>
  )
}

export default Messaging
