import React, { Fragment, Component } from 'react';
import axios from '../api';
import https from 'https';
import './Home.css';
import qs from 'qs';
import { Redirect } from 'react-router';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";
import { Link } from 'react-router-dom'

class Home extends Component {

  state = { Userid: '', Userpassword: '', flag: '', userinfo: { x: '', y: "", name: "", code: "" }, redirect: false, is_admin: -1 };




  onClickLogin = async text => {
    try {
      const response = await axios.patch('loginresponse/', qs.stringify({
        'mode': "login", 'password': this.state.Userpassword, 'account': this.state.Userid
      })
      );
      console.log(this.state.flag)
      if (response.status === 200) {
        const info = { x: response.data.info.account.x, y: response.data.info.account.y, name: response.data.info.account.user_ingameID, code: response.data.info.account.user_ingamecode }
        this.setState({ userinfo: info })
        console.log(this.state.userinfo)
        console.log(response.data.info)
        if (response.data.info.account.is_serveradmin === 1) {
          this.setState({ is_admin: 1 })
        }
        this.setState({ redirect: true });

        //window.location.href = '/buffmain'
      } else {

      }

    } catch (error) {
      console.log(error)
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


  render() {
    const { t } = this.props;
    if (this.state.redirect && this.state.is_admin !== 1) {

      return <Redirect to={{
        pathname: "/buffmain",
        state: { name: this.state.userinfo.name, xcoor: this.state.userinfo.x, ycoor: this.state.userinfo.y }
      }} />;
    } else if (this.state.redirect && this.state.is_admin === 1) {
      return <Redirect push to={`/setbuff/`} />;
    }

    const {
      onClickLogin, handleEmailChange, handlePasswordChange
    } = this;

    return (
      <main className="Home2">
        <div className="title2">
          {t("login")}
        </div>
        <section className="form-wrapper">
          <div className="email">
            <input id="Username" value={this.state.Userid} onChange={handleEmailChange} placeholder={t("id")} />
          </div>
          <div className="password">
            <input type="text" value={this.state.Userpassword} onChange={handlePasswordChange} id="Userpassword" placeholder={t("password")} />
          </div>
          <div className="create-button" onClick={onClickLogin}>
            {t("login")}
          </div>
          <div className="create-button" onClick={event => window.location.href = '/register/'}>
            {t("register")}
          </div>
          {this.state.flag === 2 && <p style={{ color: '#ff4040', textAlign: 'center' }}> {t("error.wrongid")}</p>}
        </section>
      </main>

    );
  }

}
export default withTranslation()(Home);;