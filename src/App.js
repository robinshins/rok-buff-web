
import React, { Component, Children } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Home, Register,Etcmenu,Roktest ,BuffMain, RuinResult, SetBuff, ScreenshotInvest,BuffResult, RuinRegister, PersonalSetting,AllianceSetting,UserManagement,ScreenshotInven } from './pages';
import Header from './components/Headers';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";
import 'react-app-polyfill/ie9' //ie9~
import PrivateRoute from "./components/PrivateRouters";
import { Provider } from 'react-redux'
import AuthRoute from './components/AuthRoute'
import AdminRoute from './components/AdminRoute'
import axios from './api';
import qs from 'qs';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'




const admin = 2;
const auth = 1;
const fail = -1;


class App extends Component {

  state = {authenticate : sessionStorage.islogin, loading:false,language:""}

  signIn = async ( email, password )=> {
    try {
      const response = await axios.patch('loginresponse/', qs.stringify({
        'mode': "login", 'password':password , 'account': email
      })
      );
      console.log(response.data)
      if (response.status === 200) {
        localStorage.xcoor = JSON.stringify(response.data.info.account.x)
        localStorage.ycoor = JSON.stringify(response.data.info.account.y)
      } else {
       
      }

    } catch (error) {
      console.log(error.response)
    
    }
  
}

componentDidMount(){
  if (this.state.language === JSON.stringify("ko")) {
    i18n.changeLanguage("ko");
  } else {
    i18n.changeLanguage("en");
  }
  // var self = this;
  // setTimeout(() => {
  //   self.setState({loading: false}); }, 0);
  // if(sessionStorage.id !== undefined && sessionStorage.password !==undefined){
  //   console.log(sessionStorage.id.replace(/\"/g, ''))
  // this.signIn(sessionStorage.id.replace(/\"/g, ''),sessionStorage.password.replace(/\"/g, ''))
  // }
  //console.log(this.state.authenticate)
}

// componentWillMount(){
//   if(localStorage.id !== undefined && localStorage.password !==undefined){
//     this.signIn(localStorage.id,localStorage.password)
//     }
// }




  render() {
    console.log(this.state.authenticate)
    console.log(sessionStorage.islogin)
    if(!this.state.loading){
    return (
      <Router>
        <Header></Header>
        {this.props.children}
        <Route exact path='/' component={Home} />
        <Switch>
          <Route path='/register/' component={Register} />
          <AuthRoute  authenticated = {sessionStorage.islogin} path='/buffmain/' component={BuffMain} />
          <Route   path='/screenshotcalculator/' component={ScreenshotInven} />
          <Route   path='/roktest/' component={Roktest} />
          <AuthRoute  authenticated = {sessionStorage.islogin} path='/sidemenu/' component={Etcmenu} />
          <Route path='/ruinresult/:ruintimecode' component={RuinResult} />
          <AdminRoute  authenticated = {sessionStorage.islogin} path='/setbuff/' component={SetBuff} />
          <AuthRoute authenticated = {sessionStorage.islogin}  path='/buffresult/' component={BuffResult} />
          <AuthRoute  authenticated = {sessionStorage.islogin} path='/ruinregister/' component={RuinRegister} />
          <AuthRoute authenticated = {sessionStorage.islogin} path='/personalsetting/' component={PersonalSetting} />
          <AdminRoute  authenticated = {sessionStorage.islogin} path='/alliancesetting/' component={AllianceSetting} />
          <AdminRoute authenticated = {sessionStorage.islogin} path='/usermanagement/' component={UserManagement} />
          <AuthRoute authenticated = {sessionStorage.islogin} path='/screenshotinvest/' component={ScreenshotInvest} />
        </Switch>   
      </Router>
    )
  }else{
    return(
      <div style={{textAlign:"center"}}>
      <Loader
      type="ThreeDots"
      color="#00BFFF"
      height={100}
      width={100}
      timeout={500} //3 secs
   />
   </div>
    )
  }
}

}

export default App;
// const {input} = this.state;
// const {
//   handleChange,handleCreate,handleKeyPress,handleToggle
// } = this;
// return (
// <MemberList form = {<MemberListForm
//   value = {input}
//   onChange ={handleChange}
//   onCreate = {handleCreate}
//   onKeyPress = {handleKeyPress}

// />}>
// </MemberList>
// );