import React from "react";
import {Link} from "react-router-dom";

import "./index.css";

export default function Lander() {
    return (
        <div className="lander">
            <h1>Do you want to store your calculation history?</h1>
            <p>Login or Signup to store your calculation history :D</p>
            <div>
                <Link to="/login" className="btn btn-info btn-lg">
                    Login
                </Link>
                <Link to="/signup" className="btn btn-info btn-lg">
                    Signup
                </Link>
            </div>
        </div>
    );
}
