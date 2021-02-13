import React, { Fragment, Component } from 'react';
import axios from '../api';
import https from 'https';
import './Home.css';
import qs from 'qs';
import { Redirect} from 'react-router';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";
import { Link } from 'react-router-dom'
import propTypes from "prop-types"
import {login} from "../actions/auth"
import * as actions from '../actions';
import {connect} from 'react-redux';
import Chat from '../components/Chat'
import { ChatFeed, Message } from 'react-chat-ui'
import addNotification from 'react-push-notification';



const mapDispatchToProps = (dispatch) => ({
  set_ServerNumber: (e) => dispatch(actions.server_code(e))
});
class Home extends Component {

  state = { Userid: '', Userpassword: '', flag: '', userinfo: { x: '', y: "", name: "", code: "" }, redirect: false, is_admin: -1 ,server_code:1,is_typing:false,
  messages: [
    new Message({
      id: 1,
      message: "I'm the recipient! (The person you're talking to)",
    }), // Gray bubble
    new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
  ],
};
  // static propTypes = {
  //   login: this.propTypes.func.isRequired,
  //   isAuthenticated : this.propTypes.bool
  // }



  componentDidMount(){
    if(sessionStorage.islogin==1){
      window.location.href = '/buffmain'
    }else if(sessionStorage.islogin==2){
      window.location.href = '/setbuff'
    }

    if (localStorage.language === JSON.stringify("ko")) {
      //console.log(language)
      i18n.changeLanguage("ko");
  } else if (localStorage.language === JSON.stringify("en")) {
      i18n.changeLanguage("en");
  } else if (localStorage.language === JSON.stringify("ja")) {
      i18n.changeLanguage("ja");
  }else if (localStorage.language === JSON.stringify("VN")) {
      i18n.changeLanguage("vm");
  }else if (localStorage.language === JSON.stringify("PO")) {
      i18n.changeLanguage("po");
  }else if (localStorage.language === JSON.stringify("DE")) {
      i18n.changeLanguage("gm");
  }else if (localStorage.language === JSON.stringify("IN")) {
      i18n.changeLanguage("in");
  }
  }

  onClickLogin = async text => {
    try {
      const response = await axios.patch('loginresponse/', qs.stringify({
        'mode': "login", 'password': this.state.Userpassword, 'account': this.state.Userid
      })
      );
      localStorage.id = this.state.Userid
      //localStorage.password = this.state.Userpassword
     // console.log(response);
      //console.log(this.state.flag) 
      if (response.status === 200) {
        sessionStorage.is_login = JSON.stringify('true');
        sessionStorage.account_status = JSON.stringify( response.data.info.account.is_checked);
        const info = {
          x: response.data.info.account.x, y: response.data.info.account.y,
          name: response.data.info.account.user_ingameID, code: response.data.info.account.user_ingamecode, 
        }
        var heroes = ['클레오파트라', '알렉산더', '마르텔','선덕','조조','미나','용기병','리차드','이성계','측천무후','로하','야만인','습격자'];
        var adjectives = ['홀쭉한', '만취한', '가난한','뚱뚱한','센치한','무서운','섹시한','만만한','귀여운','건강한','허약한','배고픈','가녀린'];
        var chatNickname =  adjectives[Math.floor(Math.random()*adjectives.length)]+ " " +  heroes[Math.floor(Math.random()*heroes.length)];
        sessionStorage.chatNickname = JSON.stringify(response.data.info.account.server_code+chatNickname);
        localStorage.xcoor = JSON.stringify(response.data.info.account.x)
        localStorage.ycoor = JSON.stringify(response.data.info.account.y)
        sessionStorage.id = JSON.stringify(this.state.Userid)
        var jbRandom = Math.random();
        sessionStorage.chatId = JSON.stringify(response.data.info.account.user_code)
        sessionStorage.servernumber =JSON.stringify(response.data.info.server_number)
        sessionStorage.password = JSON.stringify(this.state.Userpassword)
        localStorage.username = JSON.stringify(response.data.info.account.user_ingameID.replace(/['"]+/g,''))
        localStorage.usercode = JSON.stringify(response.data.info.account.user_ingamecode)
        localStorage.timestamp = ''+new Date().getTime();
        //localStorage.is_admin = JSON.stringify('1')
        this.setState({ userinfo: info })
       // console.log(this.state.userinfo)
       // console.log(response.data)
        var firebase = require('firebase');
    var firebaseConfig = {
        apiKey: process.env.REACT_APP_FB_API_KEY,
        authDomain: "metal-incline-274111.firebaseapp.com",
        databaseURL: "https://metal-incline-274111.firebaseio.com",
        projectId: "metal-incline-274111",
        storageBucket: "metal-incline-274111.appspot.com",
        messagingSenderId: "587575508092",
        appId: "1:587575508092:web:0031ad6f424f79345a1df9",
        measurementId: "G-EH84K7W8W1"
      };
      var firebaseApp
      if (!firebase.apps.length) {
        firebaseApp= firebase.initializeApp(firebaseConfig);
    }
        var ref = firebase.database().ref('test/');
        var now = Date.now();
        var cutoff = now - 12 * 60 * 60 * 1000;
        var old = ref.orderByChild('normal_chat/timestamp2').endAt(cutoff).limitToLast(1);
        old.on('child_added', function(snapshot) {
            //console.log(snapshot.val())
            snapshot.ref.remove()
            //snapshot.commentsRef.remove();
        });
        if (response.data.info.account.is_serveradmin === 1) {
          this.setState({ is_admin: 1 })
          sessionStorage.islogin = 2;
          sessionStorage.is_admin = JSON.stringify('1')
        }else{
          sessionStorage.islogin = 1;
          sessionStorage.is_admin = JSON.stringify('0')
        }
        this.setState({ redirect: true, server_code:response.data.info.account.server_code});
        //this.props.set_ServerNumber(response.data.info.account.server_code);
        sessionStorage.server_code =JSON.stringify(response.data.info.account.server_code);
        sessionStorage.user_name =  JSON.stringify(response.data.info.account.user_ingameID.replace(/['"]+/g,''))

        //window.location.href = '/buffmain'
      } else {
        sessionStorage.islogin = -1;
      }

    } catch (error) {
      sessionStorage.islogin = -1;
      console.log(error.response)
      this.setState({ flag: 2 })
      //alert("아이디와 비밀번호를 확인해주세요")

    }
    //console.log(response.data)

    //this.setState({ images: response.data.result });
  }

  handleEmailChange = (e) => {
    this.setState({ Userid: e.target.value });
  }

  handlePasswordChange = (e) => {
    const idReg = /^[A-Za-z0-9]*$/;
    if (e.target.value === '' || idReg.test(e.target.value)) {
      this.setState({ Userpassword: e.target.value })
    }

  }

  appKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.onClickLogin();
    }
  }

 


  render() {
    const { t } = this.props;
   
  

    // if(sessionStorage.islogin ==1){
    //   return <Redirect to={{
    //     pathname: "/buffmain/",
    //   }} />;
    // }else if (sessionStorage.islogin ==2){
    //   return <Redirect push to={`/setbuff/`}/>
    // }
    
    if (this.state.redirect && this.state.is_admin !== 1) {
      return <Redirect to={{
        pathname: "/buffmain/",
      }} />;
    } else if (this.state.redirect && this.state.is_admin === 1) {
      return <Redirect push to={`/setbuff/`} />;
    }

    const {
      onClickLogin, handleEmailChange, handlePasswordChange
    } = this;

    return (
      <Fragment>
      <main className="testhome">
        <div className="hometitle">
          {t("login")}
        </div>
        <section className="form-wrapper">
          <div className="email">
            <input id="Username" value={this.state.Userid} onChange={handleEmailChange} placeholder={t("id")} />
          </div>
          <div className="password">
            <input type="password" value={this.state.Userpassword} onChange={handlePasswordChange} id="Userpassword" placeholder={t("password")} onKeyPress={this.appKeyPress} />
          </div>
          <div className="create-button" onClick={onClickLogin}>
            {t("login")}
          </div>
          <div className="create-button" onClick={event => window.location.href = '/register/'}>
            {t("register")}
          </div>
          <div className="rokinfo" onClick={()=>{  window.location.href = "https://gamerbox.tistory.com/m/notice/22"}}>
          {t("areuFirst")} 
          </div>
      <br/>
      <div className="rokinfo" onClick={()=>{  window.location.href = "https://introduce.gamerbox.kr";}}>
      {t("whatisit")}
      </div>
          {this.state.flag === 2 && <p style={{ color: '#ff4040', textAlign: 'center' }}> {t("error.wrongid")}</p>}
        </section>

      <div style={{display:'inline-block',textAlign:'center'}}>
      <div className="directMenu" onClick={event => window.location.href = '/screenshotcalculator/'}>
      <i class="fa fa-calculator fa-3x"  style={{verticalAlign:'middle'}} aria-hidden="true"></i>&nbsp;
        {t("screenshot_calculator")}
          </div>
          <div className="directMenu" onClick={event => window.location.href = '/roktest/'}>
          <i class="fa fa-graduation-cap fa-3x" style={{verticalAlign:'middle', marginLeft:'-40px'}}></i> &nbsp;
          {t("rok.test")}
          </div>
          <div className="directMenu" onClick={event => window.location.href = '/board/'}>
          <i class="fa fa-book fa-3x"  style={{verticalAlign:'middle'}}></i>&nbsp;
          {t("board")}
          </div>
          <br/>
      </div>
      <div  style={{textAlign:"center", verticalAlign:"middle"}}>
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" textAlign="center">
                <input type="hidden" name="cmd" value="_s-xclick" />
                <input type="hidden" name="hosted_button_id" value="G3P53UTQE4P46" />
                <input type="image" src="https://www.k-rock.eu/cms/wp-content/uploads/Donate_Button.jpg"  style={{verticalAlign:"middle"}} verticalAlign="middle" textAlign = "center" width="100" height="60" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"  />
                <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" style={{verticalAlign:"middle"}} verticalAlign="middle"/>
            </form>
            </div>
          
      <script type="text/javascript" src="//t1.daumcdn.net/kas/static/ba.min.js" async></script>

      </main>


              

             
      </Fragment>
    );
  }

}
const ReduxHome = connect(null, mapDispatchToProps)(Home)
export default withTranslation()(ReduxHome);;