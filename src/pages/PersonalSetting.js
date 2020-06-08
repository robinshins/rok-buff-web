import React, { Fragment, Component } from 'react';
import './BuffMain.css';
import axios from '../api';
import https from 'https';
import Http from '../api';

import qs from 'qs';
import { Redirect } from 'react-router';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

class PersonalSetting extends Component {

    state = { flag: -2,
 name: localStorage.username, x: localStorage.xcoor, code: localStorage.usercode,
        y: localStorage.ycoor
    };

    handleChange = (event, newValue) => {
        this.setState({ tabno: newValue });
    }
    handleSimpleStateChange = (stateInstance, e) => {

        this.setState({ [stateInstance]: e.target.value });
    }



    render() {
        const { t } = this.props;
        const { handleBuffChange, handleTimeClick, handleApplyclick, handleSimpleStateChange, handleKingdomChange } = this;

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
                    <div className="create-button" onClick={this.onModifyUser}>
                        {t("setbuff.Allmodify")}
                    </div>
                    <div className="create-button" onClick={(e) => this.handleChange(e, 0)}>
                        {t("setbuff.ModifyAlloff")}
                    </div>
                </section>

            </main>
        )

    }

}

export default withTranslation()(PersonalSetting);;