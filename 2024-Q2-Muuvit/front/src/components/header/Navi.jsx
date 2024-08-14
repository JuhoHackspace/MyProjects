import React from 'react';
import { Link } from 'react-router-dom';
import './Navi.css';
import { useLoginData } from '../../context/useLoginData';

/**
 * Navi component for the navigation bar.
 * @returns {Element}
 */


const Navi = () => {
  const loginData = useLoginData();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    loginData.setUserName('');
    loginData.setToken('');
    //console.log(loginData);
  }

  return (
      <div id="colorbar">
        <div id="navi_bar">
          <ul className="navi">
            <li><Link to="/">Etusivu</Link></li>
            <li><Link to="/search-finnkino">Näytösajat</Link></li>
            <li><Link to="/search-tmdb">Muuvihaku</Link></li>
            <li><Link to="/community">Yhteisö</Link></li>
            {!loginData.userName && <li><Link to="/login">Kirjautuminen</Link></li>}
            {loginData.userName && <li><Link to="/myaccount">Oma tili</Link></li>}
            {loginData.userName && <li><Link onClick={handleLogout}>Kirjaudu ulos</Link></li>}
          </ul>
        </div>
      </div>
  );
};

export default Navi;