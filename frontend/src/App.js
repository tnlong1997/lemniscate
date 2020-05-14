import React, {useState, useEffect} from 'react';

import './App.css';
import {Navbar, NavItem, Nav} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import Header from "./components/Header";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import { Auth } from "aws-amplify";

import Routes from "./Routes";

function App() {
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [username, setUsername] = useState(false);
    const history = useHistory();

    async function handleLogout() {
        await Auth.signOut();

        userHasAuthenticated(false);
        history.push("/login");
    }

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        try {
            const response = await Auth.currentSession();
            setUsername(response.accessToken.payload.username);
            userHasAuthenticated(true);
        }
        catch(e) {
            if (e !== 'No current user') {
                onError(e);
            }
        }

        setIsAuthenticating(false);
    }

    return (
        <div className="App container">
            <Header
                isAuthenticated={isAuthenticated}
                userHasAuthenticated={userHasAuthenticated}
                setUsername={setUsername}
            />
            <AppContext.Provider
                value={{ isAuthenticated, userHasAuthenticated, username, setUsername }}
            >
                <Routes />
            </AppContext.Provider>
        </div>
    )
}

export default App;
