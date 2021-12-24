import React, { useContext } from 'react'
import firebaseApp from '../firebase/credenciales'
import { getAuth, signOut } from 'firebase/auth'
import AdminView from '../components/AdminView'
import UserView from '../components/UserView'
import { UserContext } from '../contexts/UserContext'

function Home({ props }) {
  const auth = getAuth(firebaseApp)
  const user = useContext(UserContext)
  function signOutHandler() {
    signOut(auth)
  }
  return (
    <div>
      Home <button onClick={signOutHandler}>Salir</button>
      {user.role === 'admin' ? <AdminView /> : <UserView />}
    </div>
  )
}

export default Home
