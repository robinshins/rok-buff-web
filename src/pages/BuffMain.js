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
import * as actions from '../actions';
import { connect, useSelector } from 'react-redux';



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
        backgroundColor: '', textcolor: '', titleType: -1, is_kvk: 0, duke_wait: null, scientist_wait: null, architecture_wait: null, register_check:-1,
        notice:"",sever_status:-1
    };

    componentDidMount() {
        this.getWaitingList();
        this.getServerStat();
          if(sessionStorage.id !== undefined && sessionStorage.password !==undefined){
    console.log(sessionStorage.id.replace(/\"/g, ''))
  this.signIn(sessionStorage.id.replace(/\"/g, ''),sessionStorage.password.replace(/\"/g, ''))
  }
    }

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
    

    getServerStat = async text => {
        try {
          const response = await Http.get('userresponse/', {
            params: {
              mode: 'SERVER_info'
            }
          }
          );
    
          if (response.status === 201) {
    
            console.log(response)
            if (response.data.info.length === 0) {
              this.setState({ flag: -1 })
            } else {
              const singleItem = response.data.info
              console.log(response)
              console.log(singleItem)
              this.setState({
                  sever_status:singleItem.status_type
              })
              if (singleItem.register_check === 0) {
                this.setState({
                  register_check: true
                })
              } else if (singleItem.register_check === 1) {
                this.setState({
                  register_check: false
                })
              }
              console.log(this.state)
    
            }
          } else if (response.status === 404) {
            alert(this.props.t("notice.ServerNotExisting"))
            console.log(response)
          }
        
        } catch (error) {
            console.log(error)
          alert(this.props.t("notice.ServerNotConnected"))
    
          //TODO
          // window.location.href = '/'
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
                this.setState({ scientist_wait: response.data.info[1][0] })
                this.setState({ architecture_wait: response.data.info[2][0] })
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
                   // this.props.history.push({ state: this.state })
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
        //console.log(this.props.state.data)
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
        }
        return (
            <main className="BuffMain">
                <div>
                        <div className="title1" style={{fontSize:"0.8rem"}}>
                            {t("buff.lastworkingtime") + ":" }{this.state.lasttime}<br/>
                        </div>
                        <div style={{float:"left",fontSize:"0.8rem"}}>
                        {t("server_status") + " :  " }
                        </div>
                        {this.state.sever_status===1 &&  <div className="title1" style={{fontSize:"0.8rem",color:"grey"}}>
                            { t("server_status.sleep")}<br/>
                        </div>}
                        {this.state.sever_status===2 &&  <div className="title1" style={{fontSize:"0.8rem",color:"blue"}}>
                           { " "+t("server_status.running")}<br/>
                        </div>}
                        {this.state.sever_status===3 &&  <div className="title1" style={{fontSize:"0.8rem",color:"red"}}>
                           {t("server_status.rebooting")}<br/>
                        </div>}
                        {this.state.sever_status===4 &&  <div className="title1" style={{fontSize:"0.8rem",color:"red"}}>
                          {t("server_status.errorRebooting")}<br/>
                        </div>}
                        {this.state.sever_status===5 &&  <div className="title1" style={{fontSize:"0.8rem",color:"red"}}>
                           {t("server_status.starting")}<br/>
                        </div>}
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
                                    <waitNumber style={{ color: "#ffffff" }}> {this.state.duke_wait + t("buff.waiting")}</ waitNumber>
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
                                    <waitNumber style={{ color: "#ffffff" }}> {this.state.scientist_wait + t("buff.waiting")}</waitNumber>
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
                                    <waitNumber style={{ color: "#ffffff" }}> {this.state.architecture_wait + t("buff.waiting")}</waitNumber>
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
                </div>

            </main>

        )
    }
}

const mapStateToProps = state => ({
    state: state
})



export default withTranslation()(connect(mapStateToProps)(BuffMain));;