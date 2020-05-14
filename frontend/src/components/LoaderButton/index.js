import React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import "./index.css";

export default function LoaderButton({
    isLoading,
    disabled = false,
    ...props
}) {
    return (
        <Button
            className={`LoaderButton`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
            {props.children}
        </Button>
    );
}
