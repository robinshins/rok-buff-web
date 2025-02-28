import React from "react"
import { Route, Redirect } from "react-router-dom"

function AuthRoute({ authenticated, component: Component, render, ...rest }) {
   // console.log(authenticated)
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated == 1 ? (
          render ? (
            render(props)
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect
            to={{ pathname: "/", state: { from: props.location } }}
          />
        )
      }
    />
  )
}

export default AuthRoute