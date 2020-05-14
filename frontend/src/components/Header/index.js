import React from "react";
import {Navbar, NavItem, Nav} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import { Auth } from "aws-amplify";
import "./index.css";

export default function Header({
    isAuthenticated = false,
    userHasAuthenticated,
    setUsername,
    ...props
}) {
    const history = useHistory();

    async function handleLogout() {
        await Auth.signOut();
        setUsername("");
        userHasAuthenticated(false);
        history.push("/login");
    }

    return (
        <Navbar fluid collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to="/">Lemniscate</Link>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight>
                    {isAuthenticated
                        ? <NavItem onClick={handleLogout}>Logout</NavItem>
                        : <>
                            <LinkContainer to="/login">
                                <NavItem>Login</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/signup">
                                <NavItem>Signup</NavItem>
                            </LinkContainer>
                        </>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
