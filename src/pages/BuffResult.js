import React, { Fragment, Component, useState } from 'react';
import axios from '../api';
import Http from '../api';
import './BuffResult.css';
import { withTranslation, useTranslation } from "react-i18next";
import qs from 'qs';
import Popover from 'react-bootstrap/Popover'
import popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'

class BuffResult extends Component {
  //this component requires:
  //ttype: title_type
  state = {
    items: [], flag: '', is_admin: '', x:  this.props.location.state.xcoor,sever_status:-1,
    y:  this.props.location.state.ycoor, lostkingdom: this.props.location.state.lostkingdom,
    titleType: this.props.location.state.titleType, name: this.props.location.state.name.replace(/\"/g, ''),
    usercode:this.props.location.usercode,server_status:"",register_check:true,
  };

  myrank = 0

  componentDidMount() {
   // console.log(this.props)
    this.getRuinResult();
    this.getServerStat();
    if (sessionStorage.id !== undefined && sessionStorage.password !== undefined) {
      console.log(sessionStorage.id.replace(/\"/g, ''))
    }
    console.log(this.state)
  }
  
  getServerStat = async text => {
    try {
        const response = await Http.get('userresponse/', {
            params: {
                mode: 'SERVER_info'
            }
        }
        );
        console.log(response)

        if (response.status === 201) {

          //  console.log(response)
            if (response.data.info.length === 0) {
                this.setState({ flag: -1 })
            } else {
                const singleItem = response.data.info
                console.log(response)
                console.log(singleItem)
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
                console.log(this.state)

            }
        } else if (response.status === 404) {
            alert(this.props.t("notice.ServerNotExisting"))
           // console.log(response)
        }

    } catch (error) {
        console.log(error)
        //alert(this.props.t("notice.ServerNotConnected"))

        //TODO
        // window.location.href = '/'
    }

}
 




  getRuinResult = async text => {
    try {
     // console.log(this.props)

      const response = await axios.get('qresponse/', {
        params: {
          'mode': "get_MYQ", 'dat_time': "1900-01-01 00:00:00.00+00:00", 'title_type': this.state.titleType
        }
      }
      );
     // console.log(response)
      if (response.status === 200) {
        const singleItem = response.data.info[response.data.info.length - 1]
       // console.log(response)
        let date = new Date(singleItem.ruintime)
       // console.log(date.toString())
        const item = []
        for (var i = 0; i < response.data.info.length; i++) {
          item.push({ name: response.data.info[i][2], server: response.data.info[i][1] })
        }
        this.setState({ items: item })

       // console.log(this.state.items)
      } else if (response.status) {
        //console.log(response)
//
      }

    } catch (error) {
      this.setState({ flag: 2 })
    }
  }

 
   handleDone = async (t) => {
    try {
      const response = await axios.delete('qresponse/',{data: qs.stringify({
        'mode': "DONE", 'title_type': this.state.titleType
      })}
      );
    //  console.log(response)
      if (response.status === 200) {
        alert("done success")
        window.location.href = '/buffmain/'

      } else {
        alert(this.props.t("Done.fail"))
        window.location.href = '/buffmain/'
      }

    } catch (error) {
      alert(this.props.t("Done.fail"))
      window.location.href = '/buffmain/'
      //console.log(error.response)

    }


  }
  render() {
    const { t } = this.props;

  
    let bgColor = this.state.lostkingdom === false ? "#origin kingdom" : "#The Lost Kingdom"
    let titletype = this.state.titleType === 1 ? "duke" : this.state.titleType === 2 ? "scientist" : "architect"
    //let myrank
    let divItems = this.state.items.map((item, index) => {
     // console.log(item.name)
     // console.log(this.state.name)
      if (item.name === this.state.name) { this.myrank = index + 1 }
      return <div className="selectBox2" key={item.id}>{`(${index + 1}) ` + item.name} <span>{item.server}</span></div>
    });

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
      <main className="BuffResult">
        <div className="resulttitle">
          register complete         
        </div>
        <ul class="collection">

          <li class="collection-item">

            <div class="row">
              <p><span class="text-role">title</span> : {titletype}</p>{bgColor}
              <p><span class="text-coord">coordinate</span>  X:{this.state.x} Y:{this.state.y}</p>
              <p><span class="text-wait">wait</span> : {this.myrank}/{this.state.items.length}</p>
              <div style={{ float: "left", fontSize: "0.8rem" }}>
          {t("server_status") + ":"} &nbsp;
        </div>
        {this.state.sever_status === 1 && <div className="title1" style={{ fontSize: "0.8rem", color: "grey" }}>
          {t("server_status.sleep")}<ExplainServerstat/>
        </div>}
        {this.state.sever_status === 2 && <div className="title1" style={{  fontSize: "0.8rem", color: "blue" }}>
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
        <br/>
              <div className="DoneReload" style={{ marginLeft:"-35px",marginBottom:"-29px"}}>
                <box className="create-button" style={{ backgroundColor: "#87ceeb", color: "#ffffff"}} onClick={() => this.handleDone()}>
                  DONE</box>
                <box className="create-button" style={{ backgroundColor: "#87ceeb", color: "#ffffff" }} onClick={() => window.location.reload()}>
                  Reload</box>
              </div>
              <p style={{color:"#969696",textAlign:'center'}}>
              #{t("Done.explain")}.
              </p>
            </div>
          </li>
          
        </ul>
        <div className="resulttitle">
          Waiting List
          </div>
          <p style={{textAlign:"center", fontSize:"0.8rem",color:"#fb1c2e",marginBottom:"-10px"}}>{t("update.info")}</p>
        <section className="register-form-wrapper">
          {divItems}
        </section>
      </main>

    );
  }

}
export default withTranslation()(BuffResult);