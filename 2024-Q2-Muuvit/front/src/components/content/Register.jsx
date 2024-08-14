import React, { useEffect, useState } from 'react';
import axios from 'axios'
import '../../index.css'
import styles from '@pages/css/Login.module.css'
import { useNavigate } from "react-router-dom";

/**
 * Register component is used to register a new user to the system.
 * @param showLogin // Boolean value to show the login form.
 * @param setShowLogin // Function to set the login form.
 * @param setLoginStatus // Function to set the login status.
 * @returns {Element}
 */




const Register = ({showLogin, setShowLogin, setLoginStatus}) => {
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [credentials, setCredentials] = useState({userName: '', password: ''})
  const [credentialsValidForRegistration, setCredentialsValidForRegistration] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState({success:null, msg:''})

  const userNameValid = (userName) => {
    return userName.length > 0
  }

  const passwordValid= (password) => {
    return password.length > 0
  }


  useEffect(() => {
    setCredentialsValidForRegistration(
      userNameValid(credentials.userName) && passwordValid(credentials.password)
    )
  },[credentials])

  const openRegisterForm = () => {
    setShowRegisterForm(true);
    setShowLogin(false);
    setRegistrationStatus({success:false,msg:''})
  }

  const closeRegisterForm = () => {
    setShowRegisterForm(false);
    setLoginStatus({success:null, msg:''})
    setShowLogin(true);
  }

  const register = () => {
    console.log(credentialsValidForRegistration)
    if(!credentialsValidForRegistration) {
      setRegistrationStatus({success:false,msg:'Nimimerkki tai salasana puuttuu'})
    } else {
      if(credentials.password.length < 8) {
        setRegistrationStatus({success:false,msg:'Salasanan pituus on vähintään 8 merkkiä'})
      }else {
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/createAccount`, credentials)
        .then(function (response) {
          console.log(response.data)
          if (response.status === 200) {
            console.log('200 - käyttäjä luotu')
            setRegistrationStatus({success:true,msg:'Tervetuloa käyttäjäksi'})
          }
        })
        .catch(function(error) {
          console.log(error.response.status)
          if (error.response && error.response.status===400) {
            console.log(error.response.status)
            console.log('400 - käyttäjä on jo olemassa')
            setRegistrationStatus({success:false, msg:'Käyttäjänimi on jo olemassa'})
          } else {
            console.log('ei yhteyyttä tietokantaan')
            setRegistrationStatus({success:false, msg:'Tietokantaan ei ole yhteyttä'})
          }
        })
      }
  }
}

  const handleUsernameChange = (event) => {
    setCredentials({...credentials, userName: event.target.value})
  }

  const handlePasswordChange = (event) => {
    setCredentials({...credentials, password: event.target.value})
  }

  return (
    <div>
      <h2 className={styles.heading}>Puuttuuko tunnus?</h2>

      {!showRegisterForm ? (
        <>
          {' '}
          <div className={styles.buttons}>         
            <button className={styles.button} onClick={openRegisterForm}>Rekisteröidy</button> 
        </div>  
        </>
      ) : (
        <>
        <div>
          <p className={styles.info}>Täytä molemmat kentät. Nimimerkki on samalla kirjautumistunnuksesi. Se on uniikki, eikä voi olla sama toisella käyttäjällä.</p>
            <div className={styles.form}>
              <div className={styles.login_text}>
                <p>Nimimerkki:</p>
              </div>
                 <input className={styles.field} onChange={handleUsernameChange} type="text" placeholder="Valitse nimimerkki" />      
            </div>

            <div className={styles.form}>
                <div className={styles.login_text}>
                  <p>Salasana:</p>
                </div>
                <input className={styles.field} type = "password" onChange={handlePasswordChange} placeholder="Valitse salasana" />
            </div>
            <div className={styles.buttons}>         
              <button className={styles.button} onClick={register}>Rekisteröidy</button> 
              <button className={styles.button} onClick={closeRegisterForm}>Takaisin</button>
            </div>
            <div className={styles.login_status}>
              <p>{registrationStatus.msg}</p>
            </div>
          </div>
      </>

      )}
    </div>
  )
}

export default Register