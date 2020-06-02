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
        ruinitems: [], flag: -1,
        tabno: 0, lasttime: NaN, name: this.props.location.state.name, x: this.props.location.state.xcoor,
        y: this.props.location.state.ycoor, ischeck0: false, ischeck1: false, ischeck2: false, lostkingdom: false,
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
            if (response.status === 201) {

                if (response.data.info.length === 0) {
                    this.setState({ flag: -1 })
                } else {
                    const singleItem = response.data.info[response.data.info.length - 1]
                    console.log(response)
                    let date = new Date(singleItem.ruintime)
                    console.log(date.toString())
                    const item = [{
                        id: singleItem.ruintime_code, time: singleItem.ruintime.substring(0, 10) + " " + singleItem.ruintime.substring(11, 19),
                        ruinchecked: false, koreaTime: date.toString().substring(15, 25)
                    }]
                    this.setState({ ruinitems: item })
                    console.log(this.state.ruinitems)
                }
            } else if (response.status) {
                console.log(response)
            }

        } catch (error) {
            this.setState({ flag: 2 })
            alert("server not connected redirect to home")
            window.location.href = '/'
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
            console.log(response.data.info)
            if (response.status === 200) {
                this.setState({ duke_wait: response.data.info[0][0] })
                this.setState({ scientist_wait: response.data.info[2][0] })
                this.setState({ architecture_wait: response.data.info[1][0] })
                if (Date(response.data.info[0][2]).getTime() < Date(response.data.info[1][2]).getTime()) {
                    if (Date(response.data.info[1][2]).getTime() < Date(response.data.info[2][2]).getTime()) {
                        this.setState({ lasttime: Date(response.data.info[2][2]) })
                    }
                    else {
                        this.setState({ lasttime: Date(response.data.info[1][2]) })
                    }
                }
                else {
                    if (Date(response.data.info[0][2]).getTime() < Date(response.data.info[2][2]).getTime()) {
                        this.setState({ lasttime: Date(response.data.info[2][2]) })
                    }
                    else {
                        this.setState({ lasttime: Date(response.data.info[0][2]) })
                    }
                }
                //window.location.href = '/buffmain'
            } else {

            }

        } catch (error) {
            console.log(error.response)
        }
    }
    handleTimeClick = (e, id) => {
        const { items } = this.state;


        // 파라미터로 받은 id 를 가지고 몇번째 아이템인지 찾습니다.
        const index = items.findIndex(item => item.id === id);
        const selected = items[index]; // 선택한 객체
        const nextItems = [...items]; // 배열을 복사
        // 기존의 값들을 복사하고, checked 값을 덮어쓰기
        nextItems[index] = {
            ...selected,
            ruinchecked: !selected.ruinchecked
        };

        this.setState({
            ruinitems: nextItems
        });
    }


    handleApplyclick = async text => {
        console.log(this.state.flag)
        if (this.state.flag === -1) {
            alert("apply failed ask juissy")
        } else {
            if (this.state.ruinitems[0].ruinchecked) {
                try {
                    const response = await Http.patch('userresponse/', qs.stringify({
                        'mode': 'RUIN_register', 'ruintime_code': this.state.ruinitems[0].id
                    })
                    );
                    console.log(response)
                    if (response.status === 201) {
                        alert("apply success")
                        window.location.href = `/ruinresult/${this.state.ruinitems[0].id}/${this.state.is_admin}`
                    } else {
                        alert("apply failed")
                        window.location.href = `/ruinresult/${this.state.ruinitems[0].id}/${this.state.is_admin}`
                    }

                } catch (error) {
                    if (error.response.status === 406) {
                        alert("already registered or full")
                        window.location.href = `/ruinresult/${this.state.ruinitems[0].id}/${this.state.is_admin}`
                    }
                    window.location.href = `/ruinresult/${this.state.ruinitems[0].id}/${this.state.is_admin}`
                    console.log(error.response)
                }
            } else {
                this.setState({ flag: -2 })
            }
        }
    }


    handleGongzakChange = (e) => {
        this.setState({ backgroundColor: '#87ceeb', textcolor: '#ffffff', ischeck0: true, ischeck1: false, ischeck2: false, titleType: 1 });
    }


    handleScientistChange = () => {
        this.setState({ backgroundColor: '#87ceeb', textcolor: '#ffffff', ischeck1: true, ischeck0: false, ischeck2: false, titleType: 2 });
        //this.setState({Userid: e.target.value});
    }

    handleArchitectureChange = () => {
        this.setState({ backgroundColor: '#87ceeb', textcolor: '#ffffff', ischeck2: true, ischeck1: false, ischeck0: false, titleType: 3 });
        //this.setState({Userid: e.target.value});
    }

    handleXChange = (e) => {
        this.setState({ x: e.target.value })
        console.log(e.target.value);
    }

    handleYChange = (e) => {
        this.setState({ y: e.target.value })
        console.log(e.target.value);
    }

    handleKingdomChange = () => {
        this.setState({ backgroundColor: '#87ceeb', textcolor: '#ffffff', lostkingdom: true, is_kvk: 1 });
        //this.setState({Userid: e.target.value});
    }

    handleKingdomChange2 = () => {
        this.setState({ backgroundColor: '#87ceeb', textcolor: '#ffffff', lostkingdom: false, is_kvk: 0 });
        //this.setState({Userid: e.target.value});
    }

    handleSubmit = async text => {
        console.log(this.state);
        if (this.state.titleType !== -1) {
            try {
                const response = await axios.post('qresponse/', qs.stringify({
                    'mode': "TitleQ_request", 'user_x': this.state.x, 'user_y': this.state.y, 'title_type': this.state.titleType, 'is_kvk': this.state.is_kvk,
                })
                );
                console.log(response)

                if (response.status === 201) {
                    alert("success")
                    window.location.href = `/buffresult/${this.state.titleType}`
                } else {

                }

            } catch (error) {
                alert("fail")
                console.log(error.response)
            }
        } else {
            alert("받을 칭호를 먼저 선택해주세요")
        }
    }



    a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    handleChange = (event, newValue) => {
        this.setState({ tabno: newValue });
    }
    render() {
        const { t } = this.props;
        const { changeColor, handleGongzakChange, handleTimeClick, handleApplyclick, handleChange } = this;
        let bgColor = this.state.color_black ? this.props.color : this.props.color2
        let divItems = this.state.ruinitems.map((item) => {
            console.log(item.ruinchecked)
            if (item.ruinchecked) {
                return <div className="selectBox" key={item.id} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }} onClick={(event) => handleTimeClick(event, item.id)}>{"UTC : " + item.time}<br />{"Korea time : " + item.koreaTime}</div>

            } else {
                return (<div className="selectBox" key={item.id} onClick={(event) => handleTimeClick(event, item.id)}>{"UTC : " + item.time}<br />{"Korea time : " + item.koreaTime}</div>)

            }
        });
        return (
            <main className="BuffMain">
                <div>
                    <AppBar position="static">
                        <Tabs value={this.state.tabno} onChange={this.handleChange} aria-label="simple tabs example" >
                            <Tab label="BUFF" {...this.a11yProps(0)} />
                            <Tab label="register ruin" {...this.a11yProps(1)} />
                            <Tab label="extras" {...this.a11yProps(1)} disabled />

                        </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.tabno} index={0}>
                        <div className="title1">
                            last working time: {this.state.lasttime}
                        </div>
                        <section className="form-wrapper">
                            <div className="inputBox">
                                <p>X : </p>
                                <input type='number' value={this.state.x} id="x" placeholder="" onChange={this.handleXChange}></input>
                                <p>Y : </p>
                                <input type='number' value={this.state.y} onChange={this.handleYChange} id="y" placeholder="" />
                            </div>
                            {this.state.ischeck0 === true &&
                                <div className="selectBox" onClick={handleGongzakChange} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}>
                                    {t("buff.duke") + this.state.duke_wait}
                                </div>

                            }
                            {this.state.ischeck0 === false &&
                                <div className="selectBox" onClick={handleGongzakChange}>
                                    {t("buff.duke")}
                                    <waitNumber> {this.state.duke_wait} 명 대기중</waitNumber>
                                </div>
                            }
                            {this.state.ischeck1 === true &&
                                <div className="selectBox" onClick={this.handleScientistChange} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}>
                                    {t("buff.scientist")}
                                </div>

                            }
                            {this.state.ischeck1 === false &&
                                <div className="selectBox" onClick={this.handleScientistChange}>
                                    {t("buff.scientist")}
                                    <waitNumber> {this.state.scientist_wait} 명 대기중</waitNumber>
                                </div>
                            }
                            {this.state.ischeck2 === true &&
                                <div className="selectBox" onClick={this.handleArchitectureChange} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}>
                                    {t("buff.architecture")}
                                </div>

                            }
                            {this.state.ischeck2 === false &&
                                <div className="selectBox" onClick={this.handleArchitectureChange}>
                                    {t("buff.architecture")}
                                    <waitNumber> {this.state.architecture_wait} 명 대기중</waitNumber>
                                </div>
                            }

                            <div className="selectKingdom">
                                {this.state.lostkingdom === true &&
                                    <box id="Userpassword" onClick={this.handleKingdomChange} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}> {t("buff.lostkingdom")} </box>
                                }
                                {this.state.lostkingdom === false &&
                                    <box id="Userpassword" onClick={this.handleKingdomChange}> {t("buff.lostkingdom")} </box>
                                }

                                {this.state.lostkingdom === false &&
                                    <box id="Userpassword" onClick={this.handleKingdomChange2} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}> {t("buff.normalkingdom")} </box>
                                }
                                {this.state.lostkingdom === true &&
                                    <box id="Userpassword" onClick={this.handleKingdomChange2}> {t("buff.normalkingdom")} </box>
                                }


                            </div>
                            <div className="create-button" onClick={this.handleSubmit}>
                                {t("buff.apply")}
                            </div>
                        </section>
                    </TabPanel>
                    <TabPanel value={this.state.tabno} index={1}>
                        <div className="title2">
                            Choose time
                            </div>
                        <section className="form-wrapper">
                            {divItems}
                            {this.state.flag === -1 && <p style={{ color: '#ff4040', textAlign: 'center' }}> There is no available time</p>}
                            {this.state.flag === -2 && <p style={{ color: '#ff4040', textAlign: 'center' }}> select time first</p>}
                            <div className="create-button" onClick={handleApplyclick}>
                                apply
                                </div>
                        </section>
                    </TabPanel>
                </div>

            </main>
        )
        console.log("sadasd")
    }
}

export default withTranslation()(BuffMain);;