import React, { Component, Children } from 'react';
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

 
export default (
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
      <Route path='/ruinresult/:ruintimecode' component={RuinResult} />
      {/* ----------------Route------ */}

      <Route  authenticated = {sessionStorage.islogin} path='/buffmain/' component={BuffMain} />
      <Route  authenticated = {sessionStorage.islogin} path='/sidemenu/' component={Etcmenu} />
      <Route authenticated = {sessionStorage.islogin}  path='/buffresult/' component={BuffResult} />
      <Route  authenticated = {sessionStorage.islogin} path='/ruinregister/' component={RuinRegister} />
      <Route authenticated = {sessionStorage.islogin} path='/personalsetting/' component={PersonalSetting} />
      <Route authenticated = {sessionStorage.islogin} path='/screenshotinvest/' component={ScreenshotInvest} />

      {/* -------------AuthRoute ------------------ */}

      <Route  authenticated = {sessionStorage.islogin} path='/setbuff/' component={SetBuff} />
      <Route  authenticated = {sessionStorage.islogin} path='/setbuff/' component={SetBuff} />
      <Route  authenticated = {sessionStorage.islogin} path='/etcset/' component={Etcset} />
      <Route  authenticated = {sessionStorage.islogin} path='/alliancesetting/' component={AllianceSetting} />
      <Route authenticated = {sessionStorage.islogin} path='/usermanagement/' component={UserManagement} />

      {/* ----------------------AdminRoute---------------------- */}

    </Switch> 
    <br/>
  </Router>
);