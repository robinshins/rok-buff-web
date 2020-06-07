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
    kvk_number: 0, buffType: 0,
    makealliance_name: '', makeruin_basetime: 0, makemax_capacity: 0, makeruinable: false, makealtar_basetime: 0,
    modifyalliance_name: [], modifyruin_basetime: [], modifymax_capacity: [], modifyruinable: [], modifyaltar_basetime: [], modifyalliance_code: []
  };

  componentDidMount() {
    this.getServerStat();

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
          console.log(response)
          this.setState({
            server_number: singleItem.number, duke_time: singleItem.duke_time,
            scientist_time: singleItem.scientist_time,
            architecture_time: singleItem.architect_time,
            kvk_number: singleItem.kvk_number, register_check: singleItem.register_check
          })
          console.log(this.state)
          this.getAlliance();

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
          singleItem.forEach((element) => {
            let rdate = new Date(element.ruin_basetime)
            let adate = new Date(element.altar_basetime)

            element.ruin_basetime = rdate.toISOString().substr(0, 16)
            element.altar_basetime = adate.toISOString().substr(0, 16)
            this.state.modifyalliance_code.push(element.alliance_code)
            this.state.modifyalliance_name.push(element.alliance_name)
            this.state.modifyaltar_basetime.push(element.altar_basetime)
            this.state.modifymax_capacity.push(element.max_capacity)
            this.state.modifyruin_basetime.push(element.ruin_basetime)
            this.state.modifyruinable.push(element.ruinable)
          })
          this.setState({ alliance: singleItem })
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
        , 'ruin_basetime': this.state.makeruin_basetime, 'max_capacity': this.state.makemax_capacity,
        'ruinable': this.state.makeruinable, 'alliance_name': this.state.makealliance_name, 'server_number': this.state.server_number

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
      console.log(error)
    }
  }
  onClickModifyAlliance = async index => {
    try {
      console.log(this.state, index)
      const response = await axios.patch('userresponse/', qs.stringify({
        'mode': "ALLIANCE_management", 'mode_type': "info", "alliance_code": this.state.modifyalliance_code[index]
        , 'ruin_basetime': this.state.modifyruin_basetime[index], 'max_capacity': this.state.modifymax_capacity[index],
        'ruinable': this.state.modifyruinable[index], 'alliance_name': this.state.modifyalliance_name[index],
        'altar_basetime': this.state.modifyaltar_basetime[index]
      })
      );
      if (response.status === 200) {
        alert(this.props.t("notice.ModifySuccess"))
        window.location.reload()
      } else {
      }
    } catch (error) {
      alert(this.props.t("notice.MakeFail"))
    }
  }
  onClickDeleteAlliance = async index => {
    try {
      const response = await axios.patch('userresponse/', qs.stringify({
        'mode': "ALLIANCE_management", 'mode_type': "delete", "alliance_code": this.state.modifyalliance_code[index]
      })
      );
      if (response.status === 201) {
        alert(this.props.t("notice.DeleteSuccess"))
        window.location.reload()
      } else {
      }
    } catch (error) {
      alert(this.props.t("notice.DeleteFail"))
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
        window.location.reload()
      } else {
      }
    } catch (error) {
      console.log(error)
      alert(this.props.t("notice.ChangeFail"))
    }
  }

  handleSimpleStateChange = (stateInstance, e, type, index) => {
    if (type === "modify" || type === "make") {
      stateInstance = type + stateInstance
    }
    if (type === "modify") {
      const newItems = [...this.state[stateInstance]];
      newItems[index] = e.target.value;
      this.setState({ [stateInstance]: newItems });
    }
    else {
      this.setState({ [stateInstance]: e.target.value });
    }
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
        state: { name: this.state.userinfo.name, xcoor: this.state.userinfo.x, ycoor: this.state.userinfo.y, buffType: this.state.buffType }
      }} />;
    }

    const {
      onClickLogin,
      handleChange,
      onClickMakeAlliance, handleSimpleStateChange
    } = this;

    function alliancedata(methodOnClick, textForButton, state, index) {
      return <section className="form-wrapper">
        <div className="inputBox2">
          <p style={{ fontSize: 14 }}>{t("setbuff.Allname")}</p>
          <input id={state[0]} type="text" onChange={(e) => handleSimpleStateChange("alliance_name", e, textForButton, index)} defaultValue={state[0]} />
        </div>
        <div className="inputBox2 ">
          <p style={{ fontSize: 14 }}>{t("setbuff.Allcap")}</p>
          <input id={state[0]} type="number" onChange={(e) => handleSimpleStateChange("max_capacity", e, textForButton, index)} defaultValue={state[1]} />
        </div>
        <div className="inputBox2">
          <p style={{ fontSize: 14 }}>{t("setbuff.Allruinable")}
            <input id={state[0]} type="checkbox" onChange={(e) => handleSimpleStateChange("ruinable", e, textForButton, index)} defaultChecked={state[2]} />
          </p>
        </div>
        <div className="inputBox2">
          <p style={{ fontSize: 14 }}>{t("setbuff.Allruinstarttime")}</p>
          <input id={state[0]} type="datetime-local" onChange={(e) => handleSimpleStateChange("ruin_basetime", e, textForButton, index)} defaultValue={state[3]} />
        </div>
        <div className="inputBox2">
          <p style={{ fontSize: 14 }}>{t("setbuff.Allaltarstarttime")}</p>
          <input id={state[0]} type="datetime-local" onChange={(e) => handleSimpleStateChange("altar_basetime", e, textForButton, index)} defaultValue={state[4]} />

        </div>
        <div className="selectKingdom">
          <div className="create-button" onClick={(e) => methodOnClick[0](index)}>
            {t("setbuff.All"+textForButton)}
          </div>
          {methodOnClick.length > 1 && (
            <div className="create-button" onClick={(e) => methodOnClick[1](index)}>
              {t("setbuff.Alldelete")}
            </div>)}
        </div>
      </section >
    }

    let divItems = this.state.alliance.map((item, index) => {
      return <div>
        <div className="selectBox2" key={item.id}>{`(${index + 1}) ` + item.alliance_name}
          <div>
            {this.state.modifyAlliance === false && (
              alliancedata([this.onClickModifyAlliance, this.onClickDeleteAlliance], "modify", [item.alliance_name, item.max_capacity, item.ruinable, item.ruin_basetime, item.altar_basetime], index)
            )}
          </div>
        </div>

        <button onClick={() => this.setState({
          modifyAlliance: !this.state.modifyAlliance
        })}>
          {this.state.modifyAlliance ? t("setbuff.ModifyAllon") : t("setbuff.ModifyAlloff")}
        </button>
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
            <input id="Username" type="number" value={this.state.Userid} onChange={(e) => handleSimpleStateChange("kvk_number", e)} placeholder={this.state.kvk_number} />
          </div>
          <div className="create-button" onClick={onClickLogin}>
            {t("setbuff.Allmodify")}
          </div>
          {this.state.flag === 2 && <p style={{ color: '#ff4040', textAlign: 'center' }}> {t("error.wrongid")}</p>}
        </section>
        <div className="title2">
          {t("setbuff.manageTitle")}
          {/* <settingtype>
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
          } */}
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

            alliancedata([onClickMakeAlliance], "make", ["연맹이름", 0, false, '', '']))}
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