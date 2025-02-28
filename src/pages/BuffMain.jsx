import React, { Fragment, Component } from 'react';
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
import { Circle } from 'react-leaflet'
import * as actions from '../actions';
import { connect, useSelector } from 'react-redux';
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import './BuffMain.css';


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
        y: localStorage.ycoor, lostkingdom: localStorage.lostkingdom === undefined ||localStorage.lostkingdom === JSON.stringify(false) ? false : true , redirect: 0, ruin_selected: -1,
        backgroundColor: '', textcolor: '', titleType: -1, is_kvk: localStorage.lostkingdom === undefined ||localStorage.lostkingdom === JSON.stringify(false) ? 0 : 1, duke_wait: null, scientist_wait: null, architecture_wait: null, register_check: -1,
        notice: "", sever_status: -1, account_status: sessionStorage.account_status,clickable:true,
    };

     delayTime=()=>{
        setTimeout(() => {
            this.setState({clickable : true})
        }, 1000);

    }
    


    componentDidMount() {
        console.log(localStorage.lostkingdom === JSON.stringify(false))
        this.getServerStat();
        this.getDukewait();
        this.getSciwait();
        this.getArchwait();
        this.getWaitingList();
        if (sessionStorage.id !== undefined && sessionStorage.password !== undefined) {
            //console.log(sessionStorage.id.replace(/\"/g, ''))
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
                   // console.log(response)
                   // console.log(singleItem)
                    this.setState({
                        sever_status: singleItem.status_type
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
                   // console.log(this.state)

                }
            } else if (response.status === 404) {
                //alert(this.props.t("notice.ServerNotExisting"))
                //console.log(response)
            }

        } catch (error) {
            //console.log(error)
            //alert(this.props.t("notice.ServerNotConnected"))

            //TODO
            // window.location.href = '/'
        }

    }
    getDukewait = async text => {
        try {
          const response = await axios.get('qresponse/', {
            params: {
              'mode': "get_MYQ", 'dat_time': "1900-01-01 00:00:00.00+00:00", 'title_type': 1
            }
          }
          );
         // console.log(response)
          if (response.status === 200) {
              this.setState({duke_wait:response.data.info.length})
          
          } else {
            console.log(response)
    
          }
    
        } catch (error) {
        
        }
      }

      getSciwait = async text => {
        try {
          const response = await axios.get('qresponse/', {
            params: {
              'mode': "get_MYQ", 'dat_time': "1900-01-01 00:00:00.00+00:00", 'title_type': 2
            }
          }
          );
         // console.log(response)
          if (response.status === 200) {
              this.setState({scientist_wait:response.data.info.length})
          
          } else {
            console.log(response)
    
          }
    
        } catch (error) {
        
        }
      }

      getArchwait = async text => {
        try {
          const response = await axios.get('qresponse/', {
            params: {
              'mode': "get_MYQ", 'dat_time': "1900-01-01 00:00:00.00+00:00", 'title_type': 3
            }
          }
          );
          console.log(response)
          if (response.status === 200) {
              this.setState({architecture_wait:response.data.info.length})
          
          } else {
            console.log(response)
    
          }
    
        } catch (error) {
        
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
                   // console.log(response)
                }
            } else {
            }
        } catch (error) {
            //TODO// alert("server not connected redirect to home")
            // window.location.href = '/'
           // console.log(error)
        }
    }

    handleApplyclick = async text => {
        if (this.state.flag === -1 || this.state.ruin_selected === -1) {
           // console.log(this.state)
        } else {
            const selected = this.state.ruinitems.find(item => item.checked === true)
           // console.log(selected)
            if (selected.checked) {
                try {
                    const response = await Http.patch('userresponse/', qs.stringify({
                        'mode': 'RUIN_register', 'ruintime_code': selected.id
                    })
                    );
                   // console.log(response)
                    if (response.status === 201) {
                        window.location.reload()
                        alert(this.props.t("notice.applysuccess"))
                      

                    } else {
                        window.location.reload()
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
       // console.log(this.state);
        if(this.state.clickable){
            this.setState({clickable:false})
        if (this.state.titleType !== -1) {
            try {
                const response = await axios.post('qresponse/', qs.stringify({
                    'mode': "TitleQ_request", 'user_x': this.state.x, 'user_y': this.state.y, 'title_type': this.state.titleType, 'is_kvk': this.state.is_kvk,
                })
                );
                if (response.status === 201) {
                    sessionStorage.apply_success = JSON.stringify('1')
                    sessionStorage.title_type = JSON.stringify(this.state.titleType)
                    alert(this.props.t("notice.applysuccess"))
                    this.props.history.push({ state: this.state })
                    this.setState({ redirect: 1 })
                    window.location.reload()
                } else if (response.status === 304) {
                    // this.props.history.push({ state: this.state })
                    this.setState({ redirect: 1 })
                } else if (response.status === 406) {
                    alert(this.props.t("notice.nocoordinate"))
                }
                else {
                   // console.log(response)
                }
            } catch (error) {
                alert(this.props.t("notice.alreadyregistered"))
                this.setState({ redirect: 1 })
            }
        } else {
            alert("")
        }
    }
    }
    handleTimeClick = (id) => {
       // console.log(this.state.ruinitems)

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
            localStorage.lostkingdom = true
            //this.setState({Userid: e.target.value});
        }
        else {
            localStorage.lostkingdom = false
            this.setState({ lostkingdom: false, is_kvk: 0 });
        }
    }

    handleChange = (event, newValue) => {
        this.setState({ tabno: newValue });
    }

    handleSimpleStateChange = (stateInstance, e) => {
    
        let value ;
        if(e.target.value>1200){
            value=1200
        }else if(e.target.value<0){
            value=0
        }
        else{
            value=e.target.value
        }

        this.setState({ [stateInstance]:value});
    }

    a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    render() {
        const { center, radius } = this.props
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
                        usercode: this.state.code
                    }
                }} />;
            }
        }

        const popover = (
            <Popover id="popover-basic">
                <Popover.Content>
                    <img src="https://ifh.cc/g/FjZYQI.jpg"  width="70vw" style={{opacity:"80%",minWidth:"350px"}}></img>
                </Popover.Content>
            </Popover>
        );
        // 
        const popup =()=>{
            return popover
        }
        const Example = () => (
            <OverlayTrigger placement="left"   width="50px" height="50px" overlay={popover}>
                <Button className="important"  width="0px" height="0px" >
                </Button>
            </OverlayTrigger>
        );
        const serverStatPopover = (
            <Popover id="popover-basic"  style={{ backgroundColor: "#6c757d", opacity: "95%"}}>
                <Popover.Content style={{fontSize:"10px", marginRight:"10px",color:"#ffffff", padding:"5px"}}>
                {t("server_status.sleep")} : {t("server_explain.sleep")}<br/>
                {t("server_status.rebooting")}  :{t("server_explain.rebooting")}<br/>
                {t("server_status.errorRebooting")} : {t("server_explain.errorRebooting")}<br/>
                {t("server_status.starting")}: {t("server_explain.starting")}<br/>
                {t("server_status.authentication")} : {t("server_explain.authentication")}<br/>
                </Popover.Content>
            </Popover>
        );

        const ExplainServerstat = () => (
           
            <OverlayTrigger placement="bottom" width="50px" height="50px"  overlay={serverStatPopover}>
                <span style={{color:"#969696"}}>
                <i style={{marginLeft:"10px"}} class="fa fa-question-circle-o"></i>
                </span>
              
            </OverlayTrigger>
           
        );
        return (
            <Fragment>
            <main className="BuffMain">
                <div>
                    <div className="title1" style={{ fontSize: "0.8rem" }}>
                        {t("buff.lastworkingtime") + ":"}{this.state.lasttime}<br />
                    </div>
                    <div style={{ float: "left", fontSize: "0.8rem" }}>
                        {t("server_status") + " : "}
                    </div>
                    {this.state.sever_status === 1 && <div className="title1" style={{ fontSize: "0.8rem", color: "grey" }}>
                        {t("server_status.sleep")}<ExplainServerstat/>
                    </div>}
                    {this.state.sever_status === 2 && <div className="title1" style={{ fontSize: "0.8rem", color: "blue" }}>
                        {" " + t("server_status.running")}<ExplainServerstat/>
                    </div>}
                    {this.state.sever_status === 3 && <div className="title1" style={{ fontSize: "0.8rem", color: "red" }}>
                        {t("server_status.rebooting")}<ExplainServerstat/>
                    </div>}
                    {this.state.sever_status === 4 && <div className="title1" style={{ fontSize: "0.8rem", color: "red" }}>
                        {t("server_status.errorRebooting")}<ExplainServerstat/>
                    </div>}
                    {this.state.sever_status === 5 && <div className="title1" style={{ fontSize: "0.8rem", color: "red" }}>
                        {t("server_status.starting")}<ExplainServerstat/>
                    </div>}
                    {this.state.sever_status === 6 && <div className="title1" style={{ fontSize: "0.8rem", color: "red" }}>
                        {t("server_status.authentication")}<ExplainServerstat/>
                    </div>}
     
                    <div style={{ float: "left", fontSize: "0.8rem" }}>
                        {t("account_stauts") + " :  "}
                    </div>
                    {this, this.state.account_status == 0 && <div className="title1" style={{ fontSize: "0.8rem", color: "blue" }}>
                        {t("account_stauts.okay")}<br />
                    </div>}
                    {this, this.state.account_status == 1 && <div className="title1" style={{ fontSize: "0.8rem", color: "red" }}>
                        {t("account_stauts.notokay")}<br />
                    </div>}
                    <section className="form-wrapper">
                        <div className="inputBox">

                            <p>X : </p>
                            <input type='number' value={this.state.x} id="x" placeholder="" min="0"
                                max="1200" onChange={(e) => handleSimpleStateChange("x", e)}></input>
                            <p>Y : </p>
                            <input type='number' value={this.state.y} onChange={(e) => handleSimpleStateChange("y", e)} id="y" placeholder=""  min="0"
                                max="1200"/>
                            {/* <i class="fa fa-exclamation fa-2x" style={{marginTop:"8px"}}></i> */}

                            <Example />
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
                        <p style={{textAlign:"center", fontWeight:"bolder",color:"#fb1c2e",marginBottom:"-10px"}}>{t("update.info")}</p>
                        <div className="create-button" onClick={this.handleSubmit}>
                            {t("buff.apply")}
                        </div>
                    </section>
                </div>

            </main>

            </Fragment>

        )
    }
}

const mapStateToProps = state => ({
    state: state
})



export default withTranslation()(connect(mapStateToProps)(BuffMain));;