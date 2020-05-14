import React from "react";

export default function ColoredLine({
    color = "grey",
    height = 3
}) {
    return (
        <hr
            style={{
                color: color,
                backgroundColor: color,
                height: height
            }}
        />
    );
}
