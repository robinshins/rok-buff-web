import React, { Fragment, Component } from 'react';
import axios from '../api';
import https from 'https';
import Http from '../api';
import './SetBuff.css';
import qs from 'qs';
import { Redirect } from 'react-router';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";
import BuffResult from './BuffResult'

class Home extends Component {

  state = {
    modifyAlliance: true, showBuff: true,
    makeAlliance: true, showAlliance: true, alliance: [], server_number: 0,
    register_check: true, duke_time: 0, scientist_time: 0, architecture_time: 0,
    kvk_number: 0, ruinable: 0, ruin_basetime: 0, max_capacity: 100, alliance_code: 0, alliance_name: '', buffType: 0
  };

  componentDidMount() {
    this.getServerStat();
    this.getAlliance();

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

      if (response.status === 201) {

        console.log(response)
        if (response.data.info.length === 0) {
          this.setState({ flag: -1 })
        } else {
          const singleItem = response.data.info
          this.setState({ server_number:singleItem.server_code, duke_time: singleItem.duke_time, scientist_time: singleItem.scientist_time, architecture_time: singleItem.architecture_time, kvk_number: singleItem.kvk_number, register_check: singleItem.register_check })
          console.log(this.state)
        }
      } else if (response.status === 404) {
        alert(this.props.t("notice.ServerNotExisting"))
        console.log(response)
      }
      console.log(response)
    } catch (error) {
      alert(this.props.t("notice.ServerNotConnected"))

      //TODO
      // window.location.href = '/'
    }

  }
  getAlliance = async text => {
    try {
      const response = await Http.get('userresponse/', {
        params: {
          mode: 'ALLIANCE_list',
          server_number: this.state.server_number //1525
        }
      }
      );
      console.log(response)
      if (response.status === 201) {
        if (response.data.info.length === 0) {
          this.setState({ flag: -1 })
        } else {
          const singleItem = response.data.info
          console.log(response)
          this.setState({ alliance: singleItem })
          console.log(this.state)
        }
      } else if (response.status) {
        console.log(response)
      }
    } catch (error) {
      this.setState({ flag: 2 })
      alert(this.props.t("notice.ServerNotConnected"))
      //TODO
      // window.location.href = '/'
    }

  }

  onClickMakeAlliance = async text => {
    try {
      console.log(this.state)

      const response = await axios.patch('userresponse/', qs.stringify({
        'mode': "ALLIANCE_management", 'mode_type': "make"
        , 'ruin_basetime': this.state.ruin_basetime, 'max_capacity': this.state.max_capacity,
        'ruinable': this.state.ruinable, 'alliance_name': this.state.alliance_name,'server_code':this.state.server_number
      })
      );
      console.log(response)
      if (response.status === 201) {
        alert(this.props.t("notice.MakeSuccess"))
        //window.location.href = '/buffmain'
      } else if (response.status === 406) {
        alert(this.props.t("notice.CheckInfo"))
      } else {
        alert(this.props.t("notice.UnknownProb"))
      }
    } catch (error) {
      console.log(error.response)
      alert(this.props.t("notice.ChangeFail"))
    }
  }
  onClickModifyAlliance = async text => {
    try {
      console.log(this.state)

      const response = await axios.patch('userresponse/', qs.stringify({
        'mode': "ALLIANCE_management", 'mode_type': "info", "alliance_code": this.state.alliance_code
        , 'ruin_basetime': this.state.ruin_basetime, 'max_capacity': this.state.max_capacity,
        'ruinable': this.state.ruinable, 'alliance_name': this.state.alliance_name
      })
      );
      if (response.status === 200) {
        alert(this.props.t("notice.MakeSuccess"))
      } else {
      }
    } catch (error) {
      alert(this.props.t("notice.MakeFail"))
    }
  }
  onClickLogin = async text => {
    try {
      console.log(this.state)
      const response = await axios.patch('userresponse/', qs.stringify({
        'mode': "SERVER_management", 'mode_type': "info", 'kvk_number': this.state.kvk_number
        , 'scientist_time': this.state.scientist_time, 'duke_time': this.state.duke_time, 'architect_time': this.state.architecture_time,
        'register_check': this.state.register_check
      })
      );
      if (response.status === 200) {
        alert(this.props.t("notice.ChangeSuccess"))
      } else {
      }
    } catch (error) {
      alert(this.props.t("notice.ChangeFail"))
    }
  }

  handleSimpleStateChange = (stateInstance, e) => {

    this.setState({ [stateInstance]: e.target.value });
  }
  handleBuffType = (event, newValue) => {
    if (this.state.buffType === newValue) {
      this.setState({ buffType: 0 })
    }
    else {
      this.setState({ buffType: newValue });
    }
  }
  handleChange = (e) => {
    this.setState({
      register_check: !this.state.register_check
    })
  }
  render() {
    const { t } = this.props;
    if (this.state.redirect) {
      return <Redirect to={{
        pathname: "/buffmain",
        state: { name: this.state.userinfo.name, xcoor: this.state.userinfo.x, ycoor: this.state.userinfo.y }
      }} />;
    }

    const {
      onClickLogin,
      handleChange, handleBuffType,
      onClickMakeAlliance, handleSimpleStateChange
    } = this;

    function alliancedata(methodOnClick, textForButton, state) {
      return <section className="form-wrapper">
        <div className="inputBox2">
          <p style={{ fontSize: 14 }}>{t("setbuff.Allname")}</p>
          <input id="Username" type="text" onChange={(e) => handleSimpleStateChange("alliance_name", e)} defaultValue={state[0]} />
        </div>
        <div className="inputBox2 ">
          <p style={{ fontSize: 14 }}>{t("setbuff.Allcap")}</p>
          <input id="Username" type="number" onChange={(e) => handleSimpleStateChange("max_capacity", e)} defaultValue={state[1]} />
        </div>
        <div className="inputBox2">
          <p style={{ fontSize: 14 }}>{t("setbuff.Allruinable")}
            <input id="Username" type="checkbox" onChange={(e) => handleSimpleStateChange("ruinable", e)} defaultChecked={state[2]} />
          </p>
        </div>
        <div className="inputBox2">
          <p style={{ fontSize: 14 }}>{t("setbuff.Allruinstarttime")}</p>
          <input id="Username" type="date" onChange={(e) =>{console.log(e.data)
            handleSimpleStateChange("ruin_basetime", e)}} />
        </div>
        <div className="create-button" onClick={methodOnClick}>
          {textForButton}
        </div>
      </section>
    }

    let divItems = this.state.alliance.map((item, index) => {
      return <div className="selectBox2" key={item.id}>{`(${index + 1}) ` + item.alliance_name}
        <button onClick={() => this.setState({
          modifyAlliance: !this.state.modifyAlliance, alliance_code: item.alliance_code,
          alliance_name: item.alliance_name, ruinable: item.ruinable, ruin_basetime: item.ruin_basetime, max_capacity: item.max_capacity
        })}>
          {this.state.modifyAlliance ? t("setbuff.ModifyAllon") : t("setbuff.ModifyAlloff")}
        </button>
        <div>
          {this.state.modifyAlliance === false && (
            alliancedata(this.onClickModifyAlliance, "modify", [item.alliance_name, item.max_capacity, item.ruinable, item.ruin_basetime])
          )}
        </div>
      </div>
    });

    return (
      <main className="Home2">
        <div className="title2">
          {t("setbuff.settingTitle")}
        </div>
        <section className="form-wrapper">
          <div className="inputBox2">
            <p style={{ fontSize: 14 }}> {t("setbuff.RegisterAllow")}
              <input id="Username" type="checkbox" onChange={handleChange} defaultChecked={this.state.register_check} /></p>
          </div>
          <div className="inputBox2 ">
            <p style={{ fontSize: 14 }}>{t("setbuff.dukeRotate")}</p>
            <input id="Username" type="number" value={this.state.Userid} onChange={(e) => handleSimpleStateChange("duke_time", e)} placeholder={this.state.duke_time + t("setbuff.settingSec")} />
          </div>
          <div className="inputBox2">
            <p style={{ fontSize: 14 }}>{t("setbuff.scientistRotate")}</p>
            <input id="Username" type="number" value={this.state.Userid} onChange={(e) => handleSimpleStateChange("scientist_time", e)} placeholder={this.state.scientist_time + t("setbuff.settingSec")} />
          </div>
          <div className="inputBox2">
            <p style={{ fontSize: 14 }}>{t("setbuff.architectureRotate")}</p>
            <input id="Username" type="number" value={this.state.Userid} onChange={(e) => handleSimpleStateChange("architecture_time", e)} placeholder={this.state.architecture_time + t("setbuff.settingSec")} />
          </div>
          <div className="inputBox2">
            <p style={{ fontSize: 14 }}>{t("setbuff.kvknumber")}</p>
            <input id="Username" type="number" value={this.state.Userid} onChange={(e) => handleSimpleStateChange("kvk_number", e)} placeholder={this.state.duke_time} />
          </div>
          <div className="create-button" onClick={onClickLogin}>
            {"modify"}
          </div>
          {this.state.flag === 2 && <p style={{ color: '#ff4040', textAlign: 'center' }}> {t("error.wrongid")}</p>}
        </section>
        <div className="title2">
          {t("setbuff.manageTitle")}
          <settingtype>
            <button onClick={() => this.setState({ showBuff: !this.state.showBuff })}>
              {this.state.showBuff ? t("setbuff.liston") : t("setbuff.listoff")}
            </button>
          </settingtype>
        </div>
        <div>
          {this.state.showBuff === false && (
            <div className="selectBuff">
              {this.state.buffType === 1 &&
                <div>
                  <box id="Userpassword" onClick={() => handleBuffType("buffType", 1)} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }}> {t("buff.duke")} </box>
                  <box id="Userpassword" onClick={() => handleBuffType("buffType", 2)}> {t("buff.architecture")}} </box>
                  <box id="Userpassword" onClick={() => handleBuffType("buffType", 3)}> {t("buff.scientist")} </box>
                </div>
              }
              {this.state.buffType === 2 &&
                <div>
                  <box id="Userpassword" onClick={() => handleBuffType("buffType", 1)}> {t("buff.duke")} </box>
                  <box id="Userpassword" onClick={() => handleBuffType("buffType", 2)} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }} > {t("buff.architecture")} </box>
                  <box id="Userpassword" onClick={() => handleBuffType("buffType", 3)}> {t("buff.scientist")} </box>
                </div>
              }
              {this.state.buffType === 3 &&
                <div>
                  <box id="Userpassword" onClick={() => handleBuffType("buffType", 1)}> {t("buff.duke")} </box>
                  <box id="Userpassword" onClick={() => handleBuffType("buffType", 2)}> {t("buff.architecture")} </box>
                  <box id="Userpassword" onClick={() => handleBuffType("buffType", 3)} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }} > {t("buff.scientist")} </box>
                </div>
              }
              {this.state.buffType === 0 &&
                <div>
                  <box id="Userpassword" onClick={() => handleBuffType("buffType", 1)}> {t("buff.duke")} </box>
                  <box id="Userpassword" onClick={() => handleBuffType("buffType", 2)}> {t("buff.architecture")} </box>
                  <box id="Userpassword" onClick={() => handleBuffType("buffType", 3)}> {t("buff.scientist")} </box>
                </div>
              }
              {this.state.buffType !== 0 &&
                <BuffResult ttype={this.state.buffType} />
              }
            </div>)
          }
        </div>

        <div className="title2">
          {t("setbuff.AllsettingTitle")}
          <settingtype>
            <button onClick={() => this.setState({ makeAlliance: !this.state.makeAlliance })}>
              {this.state.makeAlliance ? t("setbuff.makeAllon") : t("setbuff.makeAlloff")}
            </button>
            <button onClick={() => this.setState({ showAlliance: !this.state.showAlliance })}>
              {this.state.showAlliance ? t("setbuff.Allliston") : t("setbuff.Alllistoff")}
            </button>
          </settingtype>
        </div>
        <div>
          {this.state.makeAlliance === false && (

            alliancedata(onClickMakeAlliance, "make", this.state))}
        </div>
        <div>
          {this.state.showAlliance === false && (
            divItems
          )}
        </div>
      </main >

    );
  }

}
export default withTranslation()(Home);;