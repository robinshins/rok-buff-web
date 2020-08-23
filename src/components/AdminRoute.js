import React from "react"
import { Route, Redirect } from "react-router-dom"

function AdminRoute({ authenticated, component: Component, render, ...rest }) {
 // console.log(authenticated == 2)
//  console.log("dsadsa")
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated == 2 ? (
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

export default AdminRoute