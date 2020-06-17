import React, { Fragment, Component } from 'react';
import './BuffMain.css';
import axios from '../api';
import https from 'https';
import Http from '../api';

import qs from 'qs';
import { Redirect } from 'react-router';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";


class PersonalSetting extends Component {

    state = {
        flag: -2,
        name: localStorage.username.replace(/\"/g, ''), x: localStorage.xcoor, code: localStorage.usercode,
        y: localStorage.ycoor, password: sessionStorage.password.replace(/\"/g, '')
    };

    handleChange = (event, newValue) => {
        this.setState({ tabno: newValue });
    }
    handleSimpleStateChange = (stateInstance, e) => {
        this.setState({ [stateInstance]: e.target.value });
    }

    onModifyUser = async text => {
        try {
            const response = await Http.patch('userresponse/', qs.stringify({
                'mode': 'USER_management', 'mode_type': 'info',
                'code': this.state.code, 'name': this.state.name
            })
            );

            // console.log(response)
            if (response.status === 201) {
                localStorage.username = JSON.stringify(this.state.name)
                localStorage.usercode = this.state.code
                localStorage.password = JSON.stringify(this.state.password)
                //alert(this.props.t("notice.ChangeSuccess"))
            } else {
                console.log(response)
            }

        } catch (error) {
            alert(this.props.t("notice.ServerNotConnect"))

            console.log(error)
        }

        this.modifyPassword();

    }

    modifyPassword = async t => {

        try {
            const response2 = await Http.patch('userresponse/', qs.stringify({
                'mode': 'USER_management', 'mode_type': 'password',
                'newPassword': this.state.password
            })
            );

            console.log(response2)
            if (response2.status === 201) {
                localStorage.password = JSON.stringify(this.state.password)
                alert(this.props.t("notice.ChangeSuccess"))
            } else {
                console.log(response2)
            }

        } catch (error) {
            alert(this.props.t("notice.ServerNotConnect"))

            console.log(error)
        }
    }



    render() {
        const { t } = this.props;
        const { handleBuffChange, handleTimeClick, handleApplyclick, handleSimpleStateChange, handleKingdomChange } = this;
        //  console.log(this.state.password)
        return (

            <main className="BuffMain">
                <div className="title2">
                    {t("settings.title")}
                </div>
                <section className="form-wrapper">
                    {/* <div className="password2">
            <input type='text' id="Userpassword" value={this.state.Userpassword} onChange={handlePasswordChange} placeholder={t("password")} />
        </div> */}
                    <div className="password2">
                        <input type='text' id="UserNickName" value={this.state.name} onChange={(e) => handleSimpleStateChange("name", e)} placeholder={t("ingameNickName")} />
                    </div>
                    <div className="password2">
                        <input type='number' id="UserId" value={this.state.code} onChange={(e) => handleSimpleStateChange("code", e)} placeholder={t("ingameCode")} />
                    </div>
                    <div className="password2">
                        <input type='text' id="UserPassword" value={this.state.password} onChange={(e) => handleSimpleStateChange("password", e)} placeholder={t("password")} />
                    </div>
                    <div className="create-button" onClick={this.onModifyUser}>
                        {t("setbuff.Allmodify")}
                    </div>
                </section>

            </main>
        )

    }

}

export default withTranslation()(PersonalSetting);;