import React, { useState } from 'react'
import firebaseApp from '../firebase/credenciales'
import { CardMedia, FormControl } from '@mui/material'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import LoadingButton from '@mui/lab/LoadingButton'
import CssBaseline from '@mui/material/CssBaseline'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardContent,
  Alert,
  AlertTitle,
  Typography,
} from '@mui/material'
function Login() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, isLoading] = useState(false)
  const [error, setError] = useState()
  const [state, setState] = useState({
    email: '',
    password: '',
    role: '',
  })
  const auth = getAuth(firebaseApp)
  const firestore = getFirestore(firebaseApp)
  async function registerUser() {
    await createUserWithEmailAndPassword(auth, state.email, state.password)
      .then((user) => {
        setError()
        const docuRef = doc(firestore, `users/${user.user.uid}`)

        setDoc(docuRef, {
          email: state.email,
          role: state.role,
        })
        return user
      })
      .catch((err) => {
        setError(err.message)
      })
  }
  async function login() {
    signInWithEmailAndPassword(auth, state.email, state.password).catch(
      (err) => {
        setTimeout(() => {
          isLoading(false)
          setError(err.message)
        }, 1000)
      }
    )
  }
  function submitHandler(event) {
    event.preventDefault()
    if (isRegistered) {
      registerUser()
    } else {
      isLoading(true)
      login()
    }
  }

  function handleChange(evt) {
    const value = evt.target.value
    setState({
      ...state,
      [evt.target.name]: value,
    })
  }

  return (
    <Container>
      <Grid container>
        <CssBaseline />
        <Grid item xs={12} sm={2} md={3}></Grid>
        <Grid item xs={12} sm={8} md={6} sx={{ pt: 3 }}>
          <Card sx={{ pt: 3 }} style={{ textAlign: 'center' }}>
            <CardMedia
              component='img'
              height='140'
              image='https://www.actus.today/wp-content/uploads/2020/07/IoT_1@2x.png'
              alt='Thorium'
            />
            <CardHeader title='Thorium' subheader='Ingresar al sistema' />
            <CardContent>
              <form onSubmit={submitHandler}>
                <Grid item sm={12} sx={{ m: 2 }}>
                  <FormControl variant='standard' fullWidth>
                    <TextField
                      label='Email'
                      variant='standard'
                      id='email'
                      name='email'
                      type='text'
                      value={state.email}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={12} sx={{ m: 2 }}>
                  <FormControl variant='standard' fullWidth>
                    <TextField
                      label='Contraseña'
                      variant='standard'
                      id='password'
                      name='password'
                      type='password'
                      defaultValue={state.password}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                {/*<Grid item sm={12} sx={{ m: 2 }}>
                  <FormControl variant='standard' style={{ width: '100%' }}>
                    <Select
                      id='role'
                      name='role'
                      value={state.role}
                      defaultValue={state.role}
                      displayEmpty
                      onChange={handleChange}
                    >
                      <MenuItem value=''>Selecciona una opción</MenuItem>
                      <MenuItem value='admin'>Administrador</MenuItem>
                      <MenuItem value='manager'>Supervisor</MenuItem>
                      <MenuItem value='user'>Operador</MenuItem>
                    </Select>
                  </FormControl>
              </Grid>*/}
                <FormControl variant='standard' sx={{ p: 2 }} fullWidth>
                  <LoadingButton
                    loading={loading}
                    variant='contained'
                    type='submit'
                  >
                    {isRegistered ? 'Registrar' : 'Iniciar sesión'}
                  </LoadingButton>
                </FormControl>
              </form>
              {/*<Button
                color='secondary'
                onClick={() => setIsRegistered(!isRegistered)}
              >
                {isRegistered
                  ? 'Ya tengo cuenta, Iniciar Sesión'
                  : 'Registrarme'}
                </Button>*/}
              {error ? (
                <Alert severity='error'>
                  <AlertTitle>Error</AlertTitle>
                  {error}
                </Alert>
              ) : (
                ''
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={2} md={3}></Grid>
      </Grid>
    </Container>
  )
}

export default Login
