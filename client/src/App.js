import React, { Component, useEffect, useState } from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import './scss/style.scss'
import Home from './views/Home/Home'
import axios from 'axios'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const [username, setUsername] = useState(null)
  const [data, setData] = useState([])
  const [mainLoading, setMainLoading] = useState(false)


  const submitUsername = async(history) => {
    localStorage.setItem('username', username)
    setMainLoading(true)
    try {
      const res = await axios.get(`http://localhost:5000/${username}/`)
      console.log(res.data);
      setData(res.data)
      const mainData = JSON.stringify(res.data)
      localStorage.setItem('data', mainData)
      setMainLoading(false)
      history.push('/dashboard')
    } catch (error) {
      console.error(error.message)
      setMainLoading(false)
    }
  }
  console.log(username)
  console.log(data)
  if(data !== []){
    <Redirect to = '/dashboard'></Redirect>
  }

  return (
    <HashRouter>
      <React.Suspense fallback={loading}>
        <Switch>
          <Route
            exact
            path="/home"
            name="Home Page"
            render={() => <Home setUsername={setUsername} submitUsername={submitUsername} mainLoading={mainLoading}/>}
          />
          <Route exact path="/login" name="Login Page" render={(props) => <Login {...props} />} />
          <Route
            exact
            path="/register"
            name="Register Page"
            render={(props) => <Register {...props} />}
          />
          <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
          <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />
          <Route
            path="/"
            name="Home"
            render={(props) => <DefaultLayout {...props} data={data} />}
          />
        </Switch>
      </React.Suspense>
    </HashRouter>
  )
}

export default App
