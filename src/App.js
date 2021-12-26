import React, { useEffect, useState } from 'react'
import firebaseApp from './firebase/credenciales'
import Home from './screens/Home'
import Login from './screens/Login'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

import { UserContext } from './contexts/UserContext'
const auth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)

function App() {
  const [user, setUser] = useState(null)
  async function getUserInfo(uid) {
    const docuRef = doc(firestore, `users/${uid}`)
    const firestoreUserData = await getDoc(docuRef)
    const userRole = firestoreUserData.data().role
    const userCustomer = firestoreUserData.data().cid
    const customerDoc = await getDoc(userCustomer)
    return {
      role: userRole,
      cid: customerDoc.id,
      customer: customerDoc.data().name,
      customerLogo: customerDoc.data().logo,
    }
  }

  function setUserInfoWithFirebaseAndFirestore(firebaseUser) {
    getUserInfo(firebaseUser.uid).then((info) => {
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: info.role,
        cid: info.cid,
        customer: info.customer,
        customerLogo: info.customerLogo,
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
