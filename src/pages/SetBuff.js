import React, { Fragment, Component } from 'react';
import axios from '../api';
import https from 'https';
import Http from '../api';
import SetBuffcss from './SetBuff.css';
import qs from 'qs';
import { Redirect } from 'react-router';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";
import BuffResult from './BuffResult'

class SetBuff extends Component {

  state = {
    modifyAlliance: true, showBuff: true, isTab0: 0, dukeWaitinglist: [], scientistWaitinglist: [], architectureWatinglist: [], dukecheck: false,
    scientistcheck: false, architecturecheck: false,
    makeAlliance: true, showAlliance: true, alliance: [], server_number: 0,
    register_check: -1, register_check_bool: true, duke_time: 0, scientist_time: 0, architecture_time: 0,
    kvk_number: 0, buffType: 0, duke_wait: 0, scientist_wait: 0, architecture_wait: 0,
    makealliance_name: "연맹이름", makeruin_basetime: '', makemax_capacity: 0, makeruinable: false, makealtar_basetime: '',
    modifyalliance_name: [], modifyruin_basetime: [], modifymax_capacity: [], modifyruinable: [], modifyaltar_basetime: [], modifyalliance_code: []
  };

  components = {
    SetBuffcss: SetBuffcss
  };

  componentDidMount() {
    this.getServerStat();
    this.getWaitingList();
    this.getWaitingMembers();
    ////console.log(this.state)
  }


  deleteDukeList = async text => {
    try {
      const response = await axios.patch('userresponse/', qs.stringify({
        'mode': "TITLEQ_management", 'title_type': 1, 'mode_type': "clear"
      })
      );
      localStorage.id = this.state.Userid
      //localStorage.password = this.state.Userpassword
      //console.log(this.response);
      //console.log(this.state.flag) 
      if (response.status === 200) {
        alert("success")
        window.location.reload()
      } else {
        alert("fail")

      }

    } catch (error) {
      alert("fail, server error")

    }
  }

  deleteSciList = async text => {
    try {
      const response = await axios.patch('userresponse/', qs.stringify({
        'mode': "TITLEQ_management", 'title_type': 2, 'mode_type': "clear"
      })
      );
      localStorage.id = this.state.Userid
      //localStorage.password = this.state.Userpassword
      //console.log(this.response);
      //console.log(this.state.flag) 
      if (response.status === 200) {
        alert("success")
        window.location.reload()
      } else {
        alert("fail")

      }

    } catch (error) {
      alert("fail, server error")

    }
  }


  deleteArchList = async text => {
    try {
      const response = await axios.patch('userresponse/', qs.stringify({
        'mode': "TITLEQ_management", 'title_type': 3, 'mode_type': "clear"
      })
      );
      localStorage.id = this.state.Userid
      //localStorage.password = this.state.Userpassword
      //console.log(this.response);
      //console.log(this.state.flag) 
      if (response.status === 200) {
        alert("success")
        window.location.reload()
      } else {
        alert("fail")

      }

    } catch (error) {
      alert("fail, server error")

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
      //console.log(response)
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
          //console.log(response)
        }
      } else {
      }
    } catch (error) {
      //TODO// alert("server not connected redirect to home")
      // window.location.href = '/'
      //console.log(error)
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

        //console.log(response)
        if (response.data.info.length === 0) {
          this.setState({ flag: -1 })
        } else {
          const singleItem = response.data.info
          //console.log(response)
          this.setState({
            server_number: singleItem.number, duke_time: singleItem.duke_time,
            scientist_time: singleItem.scientist_time,
            architecture_time: singleItem.architect_time,
            kvk_number: singleItem.kvk_number
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
          //console.log(this.state)
          this.getAlliance();

        }
      } else if (response.status === 404) {
        alert(this.props.t("notice.ServerNotExisting"))
        //console.log(response)
      }
      //console.log(response)
    } catch (error) {
      alert(this.props.t("notice.ServerNotConnected"))

      //TODO
      // window.location.href = '/'
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
          //console.log(response)
          this.setState({
            server_number: singleItem.number, duke_time: singleItem.duke_time,
            scientist_time: singleItem.scientist_time,
            architecture_time: singleItem.architect_time,
            kvk_number: singleItem.kvk_number
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
          //console.log(this.state)
          this.getAlliance();

        }
      } else if (response.status === 404) {
        alert(this.props.t("notice.ServerNotExisting"))
        //console.log(response)
      }
      //console.log(response)
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
      //console.log(response)
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
        //console.log(response)
      }
    } catch (error) {
      this.setState({ flag: 2 })
      alert(this.props.t("notice.ServerNotConnected"))
      //TODO
      // window.location.href = '/'
    }

  }

  getWaitingMembers = async text => {
    try {
      //console.log(this.props)

      const response = await axios.get('qresponse/', {
        params: {
          'mode': "get_MYQ", 'dat_time': "1900-01-01 00:00:00.00+00:00", 'title_type': 1
        }
      }
      );
      console.log(response)
      if (response.status === 200) {
        const singleItem = response.data.info[response.data.info.length - 1]
        //console.log(response)
        let date = new Date(singleItem.ruintime)
        //console.log(date.toString())
        const item = []
        for (var i = 0; i < response.data.info.length; i++) {
          item.push({ name: response.data.info[i][2], server: response.data.info[i][1], user_ingamecode: response.data.info[i][0],user_code: response.data.info[i][3]  })
        }
        this.setState({ dukeWaitinglist: item })

        //console.log(this.state.items)
      } else if (response.status) {
        //console.log(response)

      }

    } catch (error) {
      this.setState({ flag: 2 })
    }

    try {
      //console.log(this.props)

      const response = await axios.get('qresponse/', {
        params: {
          'mode': "get_MYQ", 'dat_time': "1900-01-01 00:00:00.00+00:00", 'title_type': 2
        }
      }
      );
      //console.log(response)
      if (response.status === 200) {
        const singleItem = response.data.info[response.data.info.length - 1]
        //console.log(response)
        let date = new Date(singleItem.ruintime)
        //console.log(date.toString())
        const item2 = []
        for (var i = 0; i < response.data.info.length; i++) {
          item2.push({ name: response.data.info[i][2], server: response.data.info[i][1],user_ingamecode: response.data.info[i][0],user_code: response.data.info[i][3]   })
        }
        this.setState({ scientistWaitinglist: item2 })

        //console.log(this.state.items)
      } else if (response.status) {
        //console.log(response)

      }

    } catch (error) {
      this.setState({ flag: 2 })
    }

    try {
      //console.log(this.props)

      const response = await axios.get('qresponse/', {
        params: {
          'mode': "get_MYQ", 'dat_time': "1900-01-01 00:00:00.00+00:00", 'title_type': 3
        }
      }
      );
      // console.log(response)
      if (response.status === 200) {
        const singleItem = response.data.info[response.data.info.length - 1]
        let date = new Date(singleItem.ruintime)
        //console.log(date.toString())
        const item3 = []
        for (var i = 0; i < response.data.info.length; i++) {
          item3.push({ name: response.data.info[i][2], server: response.data.info[i][1],user_ingamecode: response.data.info[i][0],user_code: response.data.info[i][3]  })
        }
        this.setState({ architectureWatinglist: item3 })

        //console.log(this.state.items)
      } else if (response.status) {
      }

    } catch (error) {
      this.setState({ flag: 2 })
    }
  }

  onClickMakeAlliance = async text => {
    try {
      //console.log(this.state)
      var ruinableset = this.state.makeruinable === false ? 0 : 1
      //console.log(this.state.makeruinable)
      if (this.state.makeruinable === 'on') {
        ruinableset = 0;
      }
      const response = await axios.patch('userresponse/', qs.stringify({
        'mode': "ALLIANCE_management", 'mode_type': "make"
        , 'ruin_basetime': this.state.makeruin_basetime, 'max_capacity': this.state.makemax_capacity,
        'ruinable': ruinableset, 'alliance_name': this.state.makealliance_name, 'server_number': this.state.server_number,
        'altar_basetime': this.state.makealtar_basetime
      })
      );
      //console.log(response)
      if (response.status === 201) {
        alert(this.props.t("notice.MakeSuccess"))
        //window.location.href = '/buffmain'
      } else if (response.status === 406) {
        alert(this.props.t("notice.CheckInfo"))
      } else {
        alert(this.props.t("notice.UnknownProb"))
      }
    } catch (error) {
      //console.log(error.response)
      alert(this.props.t("notice.ChangeFail"))
      //console.log(error)
    }
  }
  onClickModifyAlliance = async index => {
    try {
      //console.log(this.state, index)
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
      //console.log(this.state)
      let regicheck;
      if (this.state.register_check) {
        regicheck = 0;
      } else {
        regicheck = 1;
      }
      const response = await axios.patch('userresponse/', qs.stringify({
        'mode': "SERVER_management", 'mode_type': "info", 'kvk_number': this.state.kvk_number
        , 'scientist_time': this.state.scientist_time, 'duke_time': this.state.duke_time, 'architect_time': this.state.architecture_time,
        'register_check': regicheck
      })
      );
      if (response.status === 200) {
        alert(this.props.t("notice.ChangeSuccess"))
        window.location.reload()
      } else {
      }
    } catch (error) {
      //console.log(error)
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

  handleTabChange = (id) => {
    this.setState({
      isTab0: id
    })
  }

  handleDeleteclick = async (user_code, title_type) => {
    console.log(user_code)
    // const code = this.state.items[index].user_code
    // console.log(code);
    console.log("sadasd")
    try {
      const response = await axios.patch('userresponse/', qs.stringify({
        'mode': "TITLEQ_management", 'mode_type': 'remove', 'user_code': user_code, 'title_type': title_type
      })
      );
      console.log(response)
      if (response.status === 200) {
        alert("delete success")
        window.location.reload()
      } else if (response.status) {
        alert("delete fail")
        console.log(response)
      }

    } catch (error) {
      console.log(error.response)
      alert("delete fail, server error")
    }
  }



  render() {
    const { t } = this.props;
    //console.log(this.state.makeruinable)
    let dukeList = this.state.dukeWaitinglist.map((item, index) => {
      return <div className="waitSelectBox" key={item.id}>
        {`(${index + 1}) ` + item.name}
        <span>({item.user_ingamecode})</span>
        <button class="x-box" onClick={() => this.handleDeleteclick(item.user_code, 1)}>
          {t("delete")}
        </button>
      </div>
    });

    let scientistList = this.state.scientistWaitinglist.map((item, index) => {
      return <div className="waitSelectBox" key={item.id}>{`(${index + 1}) ` + item.name}
        <span>({item.user_ingamecode})</span>
        <button class="x-box" onClick={() => this.handleDeleteclick(item.user_code, 2)}>
          {t("delete")}
        </button>
      </div>
    });

    let architectureList = this.state.architectureWatinglist.map((item, index) => {
      return <div className="waitSelectBox" key={item.id}>{`(${index + 1}) ` + item.name}
        <span>({item.user_ingamecode})</span>
        <button class="x-box" onClick={() => this.handleDeleteclick(item.user_code, 3)}>
          {t("delete")}
        </button>
      </div>
    });

    if (this.state.redirect) {
      return <Redirect to={{
        pathname: "/buffmain",
        state: { name: this.state.userinfo.name, xcoor: this.state.userinfo.x, ycoor: this.state.userinfo.y, buffType: this.state.buffType }
      }} />;
    }

    const {
      onClickLogin,
      handleChange,
      components,
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
            {t("setbuff.All" + textForButton)}
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

    let titlesetting = () => {
      return (<section className="form-wrapper">
        <div className="inputBox2">
          <p style={{ fontSize: 14 }}> {t("setbuff.RegisterAllow")}
            <input id="Username" type="checkbox" onChange={handleChange} checked={this.state.register_check} /></p>
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
      </section>
      )
    }

    let clickDuke = () => {
      this.setState({
        dukecheck: !this.state.dukecheck
      })
    }
    let clickSci = () => {
      this.setState({
        scientistcheck: !this.state.scientistcheck
      })
    }

    let clickArch = () => {
      this.setState({
        architecturecheck: !this.state.architecturecheck
      })
    }

    const waitinglist = () => {
      return (
        <section className="form-wrapper">
          <div className="selectBox" style={{ marginTop: "30px" }} onClick={() => clickDuke()}>
            {t("buff.duke")}
            <waitNumber> {this.state.duke_wait + t("buff.waiting")}</waitNumber>
          </div>
          {this.state.dukecheck && dukeList}
          <div className="create-button2" onClick={() => this.deleteDukeList()}>
            {t("setbuff.deletedukelist")}
          </div>
          <div className="selectBox" onClick={() => clickSci()}>
            {t("buff.scientist")}
            <waitNumber> {this.state.scientist_wait + t("buff.waiting")}</waitNumber>
          </div>
          {this.state.scientistcheck && scientistList}
          <div className="create-button2" onClick={() => this.deleteSciList()}>
            {t("setbuff.deletescilist")}
          </div>
          <div className="selectBox" onClick={() => clickArch()}>
            {t("buff.architecture")}
            <waitNumber> {this.state.architecture_wait + t("buff.waiting")}</waitNumber>
          </div>
          {this.state.architecturecheck && architectureList}
          <div className="create-button2" onClick={() => this.deleteArchList()}>
            {t("setbuff.deletearchlist")}
          </div>
        </section>
      )
    }

    return (
      <main className="Home3">
        <div className="title2" onClick={() => this.handleTabChange(0)}>
          {t("setbuff.settingTitle")}
        </div>
        <div className="title2" onClick={() => this.handleTabChange(1)}>
          {t("setbuff.waitinglist")}
        </div>
        <br />
        {this.state.isTab0 === 0 && titlesetting()}
        {this.state.isTab0 === 1 && waitinglist()}
      </main >
    );
  }

}
export default withTranslation()(SetBuff);;