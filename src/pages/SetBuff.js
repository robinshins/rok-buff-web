import React, { Fragment, Component } from 'react';
import axios from '../api';
import https from 'https';
import Http from '../api';
import './SetBuff.css';
import qs from 'qs';
import { Redirect } from 'react-router';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";

class Home extends Component {

  state = {
    modifyAlliance: true,
    makeAlliance: true, showAlliance: true, alliance: [], server_number: 0,
    register_check: true, duke_time: 0, scientist_time: 0, architecture_time: 0,
    kvk_number: 0, ruinable: false, ruin_basetime: 0, max_capacity: 100, alliance_code: 0, alliance_name: ''
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

        if (response.data.info.length === 0) {
          this.setState({ flag: -1 })
        } else {
          const singleItem = response.data.info
          console.log(response)
          this.setState({ server_number: singleItem.number, duke_time: singleItem.duke_time, scientist_time: singleItem.scientist_time, architecture_time: singleItem.architecture_time, kvk_number: singleItem.kvk_number, register_check: singleItem.register_check })
          console.log(this.state)
        }
      } else if (response.status) {
        console.log(response)
      }
      console.log(response)
    } catch (error) {
      alert("server not connected redirect to home")

      this.setState({ flag: 2 })
      window.location.href = '/'
    }

  }
  getAlliance = async text => {
    try {
      const response = await Http.get('userresponse/', {
        params: {
          mode: 'ALLIANCE_list',
          server_number: 1525//this.state.server_number
        }
      }
      );
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
      alert("server not connected redirect to home")

      this.setState({ flag: 2 })
      window.location.href = '/'

    }

  }

  onClickMakeAlliance = async text => {
    try {
      console.log(this.state)

      const response = await axios.patch('userresponse/', qs.stringify({
        'mode': "ALLIANCE_management", 'mode_type': "make"
        , 'ruin_basetime': this.state.ruin_basetime, 'max_capacity': this.state.max_capacity,
        'ruinable': this.state.ruinable, 'alliance_name': this.state.alliance_name
      })
      );
      console.log(response.data)
      if (response.status === 201) {
        alert("make success")
        //window.location.href = '/buffmain'
      } else {
      }
    } catch (error) {
      alert("change fail")
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
      console.log(response.data)
      if (response.status === 200) {
        alert("make success")
      } else {
      }
    } catch (error) {
      alert("change fail")
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
      console.log(response.data)
      if (response.status === 200) {
        alert("change success")
      } else {

      }

    } catch (error) {
      alert("change fail")

    }
  }

  handleDukeChange = (e) => {
    this.setState({ duke_time: e.target.value });
  }

  handleSciChange = (e) => {
    this.setState({ scientist_time: e.target.value });
  }

  handleArcChange = (e) => {
    this.setState({ architecture_time: e.target.value });
  }
  handleAllianceNameChange = (e) => {
    this.setState({ alliance_name: e.target.value });
  }
  handleMaxCapacityChange = (e) => {
    this.setState({ max_capacity: e.target.value });
  }
  handleRuinableChange = (e) => {
    this.setState({ ruinable: !this.state.ruinable });
  }
  handleRuinTimeChange = (e) => {
    this.setState({ ruin_basetime: e.target.value });
  }
  handleKVKServerChange = (e) => {
    this.setState({ kvk_number: e.target.value });
  }
  handleRegisterAllow = (e) => {
    console.log(e.target)
    this.setState({ register_check: e.target.value });
  }
  handleChange = (e) => {
    this.setState({
      register_check: !this.state.register_check
    })
  }
  handleAllianceMake = (e) => {
    this.setState({ makeAlliance: !this.state.makeAlliance });
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
      onClickLogin, handleArcChange, handleDukeChange, handleSciChange, handleKVKServerChange,
      handleChange, handleAllianceMake, handleAllianceNameChange, handleMaxCapacityChange,
      handleRuinableChange, handleRuinTimeChange, onClickMakeAlliance
    } = this;



    function alliancedata(methodOnClick, textForButton, state) {
      return <section className="form-wrapper">
        <div className="inputBox2">
          <p style={{ fontSize: 14 }}>alliance name</p>
          <input id="Username" type="text" onChange={handleAllianceNameChange} defaultValue={state[0]} />
        </div>
        <div className="inputBox2 ">
          <p style={{ fontSize: 14 }}>max_capacity</p>
          <input id="Username" type="number" onChange={handleMaxCapacityChange} defaultValue={state[1]} />
        </div>
        <div className="inputBox2">
          <p style={{ fontSize: 14 }}>ruinable
      <input id="Username" type="checkbox" onChange={handleRuinableChange} defaultChecked={state[2]} />
          </p>
        </div>
        <div className="inputBox2">
          <p style={{ fontSize: 14 }}>ruin start time</p>
          <input id="Username" type="date" onChange={handleRuinTimeChange} />
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
          {this.state.modifyAlliance ? '연맹 정보 수정하기' : '취소'}
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
          Server Setting
          </div>
        <section className="form-wrapper">
          <div className="inputBox2">
            <p style={{ fontSize: 14 }}>register allow
            <input id="Username" type="checkbox" onChange={handleChange} defaultChecked={this.state.register_check} /></p>
          </div>
          <div className="inputBox2 ">
            <p style={{ fontSize: 14 }}>duke rotation time</p>
            <input id="Username" type="number" value={this.state.Userid} onChange={handleDukeChange} placeholder={this.state.duke_time + "secs"} />
          </div>
          <div className="inputBox2">
            <p style={{ fontSize: 14 }}>scientist rotation time</p>
            <input id="Username" type="number" value={this.state.Userid} onChange={handleSciChange} placeholder={this.state.scientist_time + "secs"} />
          </div>
          <div className="inputBox2">
            <p style={{ fontSize: 14 }}>architecture rotation time</p>
            <input id="Username" type="number" value={this.state.Userid} onChange={handleArcChange} placeholder={this.state.architecture_time + "secs"} />
          </div>
          <div className="inputBox2">
            <p style={{ fontSize: 14 }}>KVK server number</p>
            <input id="Username" type="number" value={this.state.Userid} onChange={handleKVKServerChange} placeholder={this.state.duke_time} />
          </div>
          <div className="create-button" onClick={onClickLogin}>
            {"modify"}
          </div>
          {this.state.flag === 2 && <p style={{ color: '#ff4040', textAlign: 'center' }}> {t("error.wrongid")}</p>}
        </section>
        <div className="title2">
          Alliance Setting
          <settingtype>
            <button onClick={handleAllianceMake}>
              {this.state.makeAlliance ? '연맹 만들기' : '만들기 가리기'}
            </button>
            <button onClick={() => this.setState({ showAlliance: !this.state.showAlliance })}>
              {this.state.showAlliance ? '연맹 목록 보기' : '연맹 목록 가리기'}
            </button>
          </settingtype>
        </div>
        <div>


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