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

class TabPanel extends Component {
    render() {
        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={this.props.value !== this.props.index}
                id={`simple-tabpanel-${this.props.index}`}
                aria-labelledby={`simple-tab-${this.props.index}`}
                {...this.props.other}>
                <Box p={3}>{this.props.children}</Box>
            </Typography>
        );
    }
}
class BuffMain extends Component {
    state = {
        ruinitems: [], flag: -2,
        tabno: 0, lasttime: NaN, name: localStorage.username, x: localStorage.xcoor, code: localStorage.usercode,
        y: localStorage.ycoor, lostkingdom: false, redirect: 0, ruin_selected: -1,
        backgroundColor: '', textcolor: '', titleType: -1, is_kvk: 0, duke_wait: null, scientist_wait: null, architecture_wait: null
    };

    componentDidMount() {
        this.getWaitingList();
        this.getRuintime();
    }

    getRuintime = async text => {
        try {
            const response = await Http.get('userresponse/', {
                params: {
                    mode: 'RUIN_time'
                }
            }
            );
            console.log(response)
            if (response.status === 201) {

                if (response.data.info.length === 0) {
                    this.setState({ flag: -1 })
                } else {
                    const singleItem = response.data.info;
                    console.log(singleItem)
                    const items = []
                    singleItem.forEach(element => {
                        let date = new Date(element.ruintime)
                        //date.setHours(date.getHours()+9)
                        console.log(date.toString())
                        //const newitems = [...this.state.items]
                        if (element.ruin_type === 1) {
                            var ruin_type = 'ruin'
                        }
                        else {
                            var ruin_type = 'altar'
                        }
                        items.push({
                            id: element.ruintime_code,
                            time: element.ruintime.substring(0, 10) + " " + element.ruintime.substring(11, 19),
                            checked: false,
                            koreaTime: date.toString().substring(15, 25),
                            ruin_type: ruin_type,
                            alliance_name: element.alliance_name
                        })
                    }
                    )
                    this.setState({ ruinitems: items })
                }
            } else if (response.status) {
                this.setState({ flag: -3 })
            }
        } catch (error) {
            console.log(error)

            this.setState({ flag: 2 })
        }
    }
    getWaitingList = async text => {
        try {
            const response = await axios.get('qresponse/', {
                params: {
                    'mode': "get_QCOUNT"
                }
            }
            );
            if (response.status === 200) {
                this.setState({ duke_wait: response.data.info[0][0] })
                this.setState({ scientist_wait: response.data.info[2][0] })
                this.setState({ architecture_wait: response.data.info[1][0] })
                let checktime = NaN
                if (Date(response.data.info[0][2]) < Date(response.data.info[1][2])) {
                    if (Date(response.data.info[1][2]) < Date(response.data.info[2][2])) {
                        checktime = response.data.info[2][2]
                    }
                    else {
                        checktime = response.data.info[1][2]
                    }
                }
                else {
                    if (Date(response.data.info[0][2]) < Date(response.data.info[2][2])) {
                        checktime = response.data.info[2][2]
                    }
                    else {
                        checktime = response.data.info[0][2]

                    }
                    let date = new Date(checktime).toString().substring(15)
                    this.setState({ lasttime: date })
                    console.log(response)
                }
            } else {
            }
        } catch (error) {
            //TODO// alert("server not connected redirect to home")
            // window.location.href = '/'
            console.log(error)
        }
    }
    onModifyUser = async text => {
        try {
            const response = await Http.patch('userresponse/', qs.stringify({
                'mode': 'USER_management', 'mode_type': 'info',
                'code': this.state.code, 'name': this.state.name
            })
            );
            if (response.status === 201) {
                alert(this.props.t("notice.ChangeSuccess"))
            } else {
                console.log(response)
            }

        } catch (error) {
            alert(this.props.t("notice.ServerNotConnect"))

            console.log(error)
        }
    }
    onModifyUserPassword = async text => {
        try {
            const response = await Http.patch('userresponse/', qs.stringify({
                'mode': 'USER_management', 'mode_type': 'password',
                'newPassword': this.state.password
            })
            );
            if (response.status === 201) {
                alert(this.props.t("notice.ChangeSuccess"))
            } else if (response.status === 406) {
                alert(this.props.t("notice.checkpassword"))
            }
            else {
                console.log(response)
            }

        } catch (error) {
            alert(this.props.t("notice.ServerNotConnect"))

            console.log(error)
        }
    }

    handleApplyclick = async text => {
        if (this.state.flag === -1 || this.state.ruin_selected === -1) {
            console.log(this.state)
        } else {
            const selected = this.state.ruinitems.find(item => item.checked === true)
            console.log(selected)
            if (selected.checked) {
                try {
                    const response = await Http.patch('userresponse/', qs.stringify({
                        'mode': 'RUIN_register', 'ruintime_code': selected.id
                    })
                    );
                    console.log(response)
                    if (response.status === 201) {
                        alert(this.props.t("notice.applysuccess"))
                    } else {
                        alert(this.props.t("notice.applyfail"))
                    }
                    this.props.history.push({ state: this.state })

                    this.setState({ redirect: 2, ruin_selected: selected.id })
                } catch (error) {
                    if (error.response.status === 406) {
                        alert(this.props.t("notice.applyfull"))
                        this.props.history.push({ state: this.state })

                        this.setState({ redirect: 2, ruin_selected: selected.id })
                    }
                    this.props.history.push({ state: this.state })

                    this.setState({ redirect: 2, ruin_selected: selected.id })
                    console.log(error.response)
                    //console.log(response.error)
                    //alert("아이디와 비밀번호를 확인해주세요")
                }
            } else {
                this.setState({ flag: -2 })
            }
        }
    }
    handleSubmit = async text => {
        console.log(this.state);
        if (this.state.titleType !== -1) {
            try {
                const response = await axios.post('qresponse/', qs.stringify({
                    'mode': "TitleQ_request", 'user_x': this.state.x, 'user_y': this.state.y, 'title_type': this.state.titleType, 'is_kvk': this.state.is_kvk,
                })
                );
                if (response.status === 201) {
                    alert(this.props.t("notice.applysuccess"))
                    this.props.history.push({ state: this.state })
                    this.setState({ redirect: 1 })
                } else if (response.status === 304) {
                    this.props.history.push({ state: this.state })
                    this.setState({ redirect: 1 })
                } else if (response.status === 406) {
                    alert(this.props.t("notice.nocoordinate"))
                }
                else {
                    console.log(response)
                }
            } catch (error) {
                alert(this.props.t("notice.alreadyregistered"))
                this.setState({ redirect: 1 })
            }
        } else {
            alert("")
        }
    }
    handleTimeClick = (id) => {
        console.log(this.state.ruinitems)

        const { ruinitems } = this.state;
        // 파라미터로 받은 id 를 가지고 몇번째 아이템인지 찾습니다.
        const index = ruinitems.findIndex(item => item.id === id);
        const selected = ruinitems[index]; // 선택한 객체
        ruinitems.forEach(item => item.checked = false)

        const nextItems = [...ruinitems]; // 배열을 복사
        // 기존의 값들을 복사하고, checked 값을 덮어쓰기
        nextItems[index] = {
            ...selected,
            checked: !selected.checked
        };
        if (!selected.checked === false) {
            this.setState({ ruin_selected: -1 })
        }
        else {
            this.setState({ ruin_selected: 1 })
        }
        this.setState({
            ruinitems: nextItems
        });
    }
    handleBuffChange = (e, newValue) => {
        this.setState({ titleType: newValue });
        //this.setState({Userid: e.target.value});
    }

    handleKingdomChange = (e, newValue) => {
        if (newValue === 1) {
            this.setState({ lostkingdom: true, is_kvk: 1 });
            //this.setState({Userid: e.target.value});
        }
        else {
            this.setState({ lostkingdom: false, is_kvk: 0 });
        }
    }

    handleChange = (event, newValue) => {
        this.setState({ tabno: newValue });
    }
    handleSimpleStateChange = (stateInstance, e) => {

        this.setState({ [stateInstance]: e.target.value });
    }
    a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    render() {
        const { t } = this.props;
        const { handleBuffChange, handleTimeClick, handleApplyclick, handleSimpleStateChange, handleKingdomChange } = this;
        let bgColor = this.state.color_black ? this.props.color : this.props.color2
        let divItems = this.state.ruinitems.map((item, index) => {
            if (item.checked === true && item.ruin_type == "ruin") {
                return <div className="selectBox" key={item.id} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}
                    onClick={() => handleTimeClick(item.id)}>{"UTC : " + item.time}<br />{"Korea time : " + item.koreaTime}{"type : " + t("ruin")}
                </div>
            } else if (item.checked === true && item.ruin_type == "altar") {
                return <div className="selectBox" key={item.id} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}
                    onClick={() => handleTimeClick(item.id)}>{"UTC : " + item.time}<br />{"Korea time : " + item.koreaTime}{"type : " + t("altar")}
                </div>
            } else if (item.checked === false && item.ruin_type == "ruin") {
                return <div className="selectBox" key={item.id} onClick={() => handleTimeClick(item.id)
                }> {"UTC : " + item.time} < br /> {"Korea time : " + item.koreaTime} {"type : " + t("ruin")}
                </div >
            }
            else if (item.checked === false && item.ruin_type == "altar") {
                return <div className="selectBox" key={item.id} onClick={() => handleTimeClick(item.id)
                }> {"UTC : " + item.time} < br /> {"Korea time : " + item.koreaTime} {"type : " + t("altar")}
                </div >
            }
        });
        if (this.state.redirect !== 0) {
            if (this.state.redirect === 1) {
                return <Redirect to={{
                    pathname: "/buffresult",
                    state: {
                        name: this.state.name,
                        xcoor: this.state.x,
                        ycoor: this.state.y,
                        lostkingdom: this.state.lostkingdom,
                        titleType: this.state.titleType,
                    }
                }} />;
            }
            else if (this.state.redirect === 2) {
                return <Redirect to={{
                    pathname: "/ruinresult",
                    state: {
                        ruin_selected: this.state.ruin_selected

                    }
                }} />;
            }
        }
        return (
            <main className="BuffMain">
                <div>
                    {/* <AppBar position="static">
                        <Tabs value={this.state.tabno} onChange={this.handleChange} aria-label="simple tabs example" >
                            <Tab label={t("buff")} {...this.a11yProps(0)} />
                            <Tab label={t("ruin")} {...this.a11yProps(1)} />
                            <Tab label={t("extra")} {...this.a11yProps(2)} disabled />
                            <Tab label={t("settings")} {...this.a11yProps(3)} />
                        </Tabs>
                    </AppBar> */}
                    <TabPanel value={this.state.tabno} index={0}>
                        <div className="title1">
                            {t("buff.lastworkingtime") + ":" + this.state.lasttime}
                        </div>
                        <section className="form-wrapper">
                            <div className="inputBox">
                                <p>X : </p>
                                <input type='number' value={this.state.x} id="x" placeholder="" onChange={(e) => handleSimpleStateChange("x", e)}></input>
                                <p>Y : </p>
                                <input type='number' value={this.state.y} onChange={(e) => handleSimpleStateChange("y", e)} id="y" placeholder="" />
                            </div>
                            {this.state.titleType === 1 &&
                                <div className="selectBox" onClick={(e) => handleBuffChange(e, 1)} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}>
                                    {t("buff.duke")}
                                    <waitNumber style = {{color:"#ffffff"}}> {this.state.duke_wait + t("buff.waiting")}</ waitNumber>
                                </div>
                            }
                            {this.state.titleType !== 1 &&
                                <div className="selectBox" onClick={(e) => handleBuffChange(e, 1)}>
                                    {t("buff.duke")}
                                    <waitNumber> {this.state.duke_wait + t("buff.waiting")}</ waitNumber>
                                </div>
                            }
                            {this.state.titleType === 2 &&
                                <div className="selectBox" onClick={(e) => handleBuffChange(e, 2)} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}>
                                    {t("buff.scientist")}
                                    <waitNumber style = {{color:"#ffffff"}}> {this.state.scientist_wait + t("buff.waiting")}</waitNumber>
                                </div>
                            }
                            {this.state.titleType !== 2 &&
                                <div className="selectBox" onClick={(e) => handleBuffChange(e, 2)}>
                                    {t("buff.scientist")}
                                    <waitNumber> {this.state.scientist_wait + t("buff.waiting")}</waitNumber>
                                </div>
                            }
                            {this.state.titleType === 3 &&
                                <div className="selectBox" onClick={(e) => handleBuffChange(e, 3)} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}>
                                    {t("buff.architecture")}
                                    <waitNumber style = {{color:"#ffffff"}}> {this.state.architecture_wait + t("buff.waiting")}</waitNumber>
                                </div>
                            }
                            {this.state.titleType !== 3 &&
                                <div className="selectBox" onClick={(e) => handleBuffChange(e, 3)}>
                                    {t("buff.architecture")}
                                    <waitNumber> {this.state.architecture_wait + t("buff.waiting")}</waitNumber>
                                </div>
                            }

                            <div className="selectKingdom">
                                {this.state.lostkingdom === true &&
                                    <box id="Userpassword" onClick={(e) => handleKingdomChange(e, 1)} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}> {t("buff.lostkingdom")} </box>
                                }
                                {this.state.lostkingdom === false &&
                                    <box id="Userpassword" onClick={(e) => handleKingdomChange(e, 1)}> {t("buff.lostkingdom")} </box>
                                }

                                {this.state.lostkingdom === false &&
                                    <box id="Userpassword" onClick={(e) => handleKingdomChange(e, 2)} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}> {t("buff.normalkingdom")} </box>
                                }
                                {this.state.lostkingdom === true &&
                                    <box id="Userpassword" onClick={(e) => handleKingdomChange(e, 2)}> {t("buff.normalkingdom")} </box>
                                }


                            </div>
                            <div className="create-button" onClick={this.handleSubmit}>
                                {t("buff.apply")}
                            </div>
                        </section>
                    </TabPanel>
                    <TabPanel value={this.state.tabno} index={1}>
                        <div className="title2">
                            {t("ruin.choosetime")}
                        </div>
                        <section className="form-wrapper">
                            {divItems}
                            {this.state.flag === -1 && <p style={{ color: '#ff4040', textAlign: 'center' }}> {t("ruin.notime")}</p>}
                            {this.state.flag === -2 && <p style={{ color: '#ff4040', textAlign: 'center' }}> {t("ruin.selecttime")}</p>}
                            {this.state.flag === -3 && <p style={{ color: '#ff4040', textAlign: 'center' }}> {t("notice.ServerNotConnect")}</p>}

                            <div className="create-button" onClick={handleApplyclick}>
                                {t("ruin.apply")}
                            </div>
                        </section>
                    </TabPanel>
                    <TabPanel value={this.state.tabno} index={3}>
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
                    </TabPanel>
                </div>

            </main>
        )
    }
}

export default withTranslation()(BuffMain);;