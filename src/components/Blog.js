import React from 'react'

export default function Blog(props) {
    return (
        <div>
            <h2>{props.title} by {props.User.email}</h2>
            <p>{props.body}</p>
            <hr/>
        </div>
    )
}
