import React, { useEffect, useState } from 'react'
//Importamos la aplicación/credenciales
import firebaseApp from './firebase/credenciales'
import Home from './screens/Home'
import Login from './screens/Login'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

import { UserContext } from './contexts/UserContext'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
// Conforme se necesite, importar los demás servicios y funciones. Por ejemplo:
import AdminView from './components/AdminView'
const auth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)

function App() {
  const [user, setUser] = useState(null)
  async function getUserInfo(uid) {
    const docuRef = doc(firestore, `users/${uid}`)
    const firestoreUserData = await getDoc(docuRef)
    console.log(firestoreUserData)
    const userRole = firestoreUserData.data().role
    return userRole
  }

  function setUserInfoWithFirebaseAndFirestore(firebaseUser) {
    getUserInfo(firebaseUser.uid).then((role) => {
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: role,
      }
      setUser(userData)
    })
  }
  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        if (!user) {
          setUserInfoWithFirebaseAndFirestore(firebaseUser)
        }
      } else {
        setUser(null)
      }
    })
  }, [])
  return (
    <>
      <Router>
        <Routes>
          <Route path='/about' element={Home}></Route>
          <Route path='/users' element={AdminView}></Route>
          <Route path='/' element={Home}></Route>
        </Routes>
      </Router>
      {user ? (
        <UserContext.Provider value={user}>
          <Home />
        </UserContext.Provider>
      ) : (
        <Login />
      )}
    </>
  )
  //return <Login />
}

export default App
