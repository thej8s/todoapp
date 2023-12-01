import { onAuthStateChanged ,signOut} from "firebase/auth";
import React,{useEffect,useState} from "react";
import {auth} from '../firebase'


function AthDetails() {

    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
      const listen = onAuthStateChanged(auth,(user)=>{
        if(user) {
            setAuthUser(user);
            setLoading(false);

        }
        else {
            setAuthUser(null);
        }
      })
      return () => {
        listen();
        // Sign out the user to clear authentication state
        signOut(auth);
      };    }, [])
    

  return (
    <div>
        {
            console.log(authUser)}{
            authUser ? <p>Signed In</p> : <p>Signed Out</p>
        }
    </div>
  )
}

export default AthDetails