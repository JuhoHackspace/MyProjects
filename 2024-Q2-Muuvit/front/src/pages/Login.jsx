import React, { useState } from 'react'
import Register from '@content/Register';
import { Navigate } from 'react-router-dom';
import styles from './css/Login.module.css'
import axios from 'axios'
import { useLoginData } from '../context/useLoginData';
import { useNavigate } from 'react-router-dom';
/**
 * Login component is used to log in to the application.
 * @param props The properties of the component.
 * @returns {Element}
 */


export default function Login(props) {
  const loginData = useLoginData()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showLogin, setShowLogin] = useState(true)
  //const navigate = useNavigate()
  const [credentials, setCredentials] = useState({userName: '', password: ''})
  const [loginStatus, setLoginStatus] = useState({success:null, msg:''})
  const navigate = useNavigate()
  
 const login = () => {    
  if (credentials.username === '' || credentials.password === '') {
    console.log('Käyttäjätunnus ja salasana ovat pakollisia')
    setLoginStatus({success:false, msg:'Käyttäjätunnus ja salasana ovat pakollisia'})
    return;
  }
  axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, credentials)
  .then(function (response) {
    console.log(response.data)
      if (response.status === 200) {
          //sessionStorage.setItem('userName', credentials.userName)
          //sessionStorage.setItem('token', response.data)
        loginData.setToken(response.data)
        loginData.setUserName(credentials.userName)
        console.log("Login", credentials.userName)
        console.log('Kirjauduttu sisään')
        setLoginStatus({success:true,msg:'Kirjauduttu sisään'})
        navigate('/myaccount')
      }
    })
  .catch(function(error) {
    console.log(error.response.status)
      if (error.response && error.response.status===400) {
        console.log(error.response.status)
        console.log('Käyttäjää ei löydy')
        setLoginStatus({success:false, msg:'Käyttäjää ei löydy'})
      } else if(error.response && error.response.status===401) {
        console.log('Virheellinen salasana')
        setLoginStatus({success:false, msg:'Virheellinen salasana'})
      }else {
        setLoginStatus({success:false, msg:'Ei yhteyttä palvelimeen'})
      }
      console.log(error.status)
      console.log(error)
    })
  }

  const handleUsernameChange = (event) => {
    setCredentials({...credentials, userName: event.target.value})
  }

  const handlePasswordChange = (event) => {
    setCredentials({...credentials, password: event.target.value})
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      login()
    }
  }

  return (

    <div className={styles.login}>

      {showLogin && ( 
        <>
        <h2 className={styles.heading}>Kirjautuminen</h2>
        <p className={styles.info}>Älä koskaan jaa käyttäjätunnusta ja salasanaasi ulkopuolisille.</p>

            <div className={styles.form}>
              <div className={styles.login_text}>
                <p>Nimimerkki:</p>
              </div>            
              <input className={styles.field} onChange={handleUsernameChange} type="text"></input>            
            </div>

            <div className={styles.form}>
              <div className={styles.login_text}>
                <p>Salasana:</p>
              </div>           
              <input className={styles.field} type="password" onChange={handlePasswordChange} onKeyDown={handleKeyDown}></input>           
            </div>
                        
            <div className={styles.buttons}>   
            <button className={styles.button} onClick={login}>Kirjaudu sisään</button> 
            </div> 
            <div className={styles.login_status}>
              <p>{loginStatus.msg}</p>
            </div>       
          </>
      )}
          <br/> <br/>
        {!loginData.token && <Register setShowLogin={setShowLogin} setLoginStatus={setLoginStatus} />}
    </div>
  );
}