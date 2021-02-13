
import React, { Component, Children, Fragment } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Home, Register,Etcmenu,Roktest ,Error,BuffMain,Update,Update_content ,RuinResult, SetBuff,Etcset, ScreenshotInvest,BuffResult, RuinRegister, PersonalSetting,AllianceSetting,UserManagement,ScreenshotInven } from './pages';
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
import { Notifications } from 'react-push-notification';
import "./App.css"
// import Adstxt from "./ads.txt"




const admin = 2;
const auth = 1;
const fail = -1;


class App extends Component {

  state = {authenticate : sessionStorage.islogin, loading:false,language:localStorage.language}

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
componentWillMount(){
  if (this.state.language === JSON.stringify("ko")) {
    i18n.changeLanguage("ko");
  } else {
    i18n.changeLanguage("en");
  }
}
componentDidMount(){
  console.log(navigator.language)
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
      <Fragment>
      <Router>
        {/* <Notifications /> */}
        <Header></Header>
        {this.props.children}
        <Route exact path='/' component={Home} />
        <Switch>
          <Route path='/register/' component={Register} />
          <Route path='/board' component={Update} />
          <Route path='/board_content/:boardnum' component={Update_content} />
          <Route   path='/screenshotcalculator/' component={ScreenshotInven} />
          <Route   path='/roktest/' component={Roktest} />
          <Route path='/ruinresult/:ruintimecode' component={RuinResult} /> */}
          {/* <Route path='/ads.txt' component={Adstxt} />
          {/* ----------------Route------ */}

          <AuthRoute  authenticated = {sessionStorage.islogin} path='/buffmain/' component={BuffMain} />
          <AuthRoute  authenticated = {sessionStorage.islogin} path='/sidemenu/' component={Etcmenu} />
          <AuthRoute authenticated = {sessionStorage.islogin}  path='/buffresult/' component={BuffResult} />
          <AuthRoute  authenticated = {sessionStorage.islogin} path='/ruinregister/' component={RuinRegister} />
          <AuthRoute authenticated = {sessionStorage.islogin} path='/personalsetting/' component={PersonalSetting} />
          <AuthRoute authenticated = {sessionStorage.islogin} path='/screenshotinvest/' component={ScreenshotInvest} />

          {/* -------------AuthRoute ------------------ */}

          <AdminRoute  authenticated = {sessionStorage.islogin} path='/setbuff/' component={SetBuff} />
          <AdminRoute  authenticated = {sessionStorage.islogin} path='/setbuff/' component={SetBuff} />
          <AdminRoute  authenticated = {sessionStorage.islogin} path='/etcset/' component={Etcset} />
          <AdminRoute  authenticated = {sessionStorage.islogin} path='/alliancesetting/' component={AllianceSetting} />
          <AdminRoute authenticated = {sessionStorage.islogin} path='/usermanagement/' component={UserManagement} />

          {/* ----------------------AdminRoute---------------------- */}

        </Switch> 

      </Router>
              <div style={{textAlign:'center'}}>
              <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
              <ins class="adsbygoogle"
               
                  data-ad-client="ca-pub-7375020502573164"
                  data-ad-slot="5360005871"
                  data-ad-format="auto"
                  data-full-width-responsive="true"></ins>
              <script>
                  (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
              </div>
      <br/>
      </Fragment>
     
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