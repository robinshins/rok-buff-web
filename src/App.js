import React,{Component, Children} from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Home, Register, BuffMain, RuinResult , SetBuff, BuffResult} from './pages';
import Header from './components/Headers';
import {withTranslation,useTranslation} from "react-i18next";
import i18n from "i18next";
import 'react-app-polyfill/ie9' //ie9~


class App extends Component {

 

  render(){
    return(

      <Router>
              <Header/>
      {this.props.children}
      <Route exact path='/' component={Home}/>
      <Switch>
      <Route path='/register' component={Register}/>
      <Route path='/buffmain' component={BuffMain}/>
      <Route path='/ruinresult' component={RuinResult}/>
      <Route path='/setbuff' component={SetBuff}/>
      <Route path='/buffresult' component={BuffResult}/>
      </Switch>
      </Router> 
    )

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