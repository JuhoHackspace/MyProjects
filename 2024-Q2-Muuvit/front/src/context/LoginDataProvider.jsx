import { useEffect, useState } from "react";
import { LoginDataContext } from "./LoginDataContext";

/**
 * LoginDataProvider component provides login data to the application.
 * @param props The properties of the component.
 * @returns {Element}
 */


export default function LoginDataProvider(props) {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [userName, setUserName] = useState(() => localStorage.getItem('userName') || null);

    useEffect(() => {
        localStorage.setItem('token', token);
    }, [token]);

    useEffect(() => {
        localStorage.setItem('userName', userName);
    }, [userName]);

    const aggregate = {
        userName,
        token,
        setUserName,
        setToken
    };

    return (
        <LoginDataContext.Provider value={aggregate}>
            {props.children}
        </LoginDataContext.Provider>
    );
}
