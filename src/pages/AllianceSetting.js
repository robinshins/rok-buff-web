import React, { Fragment, Component } from 'react';
import './AllianceSetting.css';
import Http from '../api';
import axios from '../api';
import qs from 'qs';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";



class AllianceSetting extends Component {
    //state = { Userid: '', Userpassword:'',flag:'',user_ingamecode:'',user_ingameID:'',server_number:'',value:''};
    state = {allianceFlag:'',
        Userid: '', Userpassword: '', flag: '', user_ingamecode: '', user_ingameID: '', server_number: '', value: '',
        modifyAlliance: [], showBuff: true,
        makeAlliance: true, showAlliance: true, alliance: [], server_number:0 ,
        register_check: true, duke_time: 0, scientist_time: 0, architecture_time: 0,
        kvk_number: 0, buffType: 0,
        makealliance_name: "연맹이름", makeruin_basetime: '', makemax_capacity: 0, makeruinable: false, makealtar_basetime: '',
        modifyalliance_name: [], modifyruin_basetime: [], modifymax_capacity: [], modifyruinable: [], modifyaltar_basetime: [], modifyalliance_code: []
    };

    componentDidMount() {
        this.getAlliance();
        this.getServerStat();
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


    onClickRegister = async text => {
        try {
            const response = await Http.post('userresponse/', qs.stringify({
                'server_number': this.state.server_number, 'password': this.state.Userpassword,
                'account': this.state.Userid, 'user_ingamecode': this.state.user_ingamecode, 'user_ingameID': this.state.user_ingameID
            })
            );
            if (response.status === 201) {
                window.location.href = '/'
            } else {
                console.log(response)
            }

        } catch (error) {
            if (error.response != null) {
                if (error.response.status === 409) {
                    this.setState({ flag: 2 })
                } else if (error.response.status === 404) {
                    this.setState({ flag: 1 })
                } else {

                }
            } else {
                this.setState({ flag: 3 })
            }
            console.log(error)
            //console.log(response.error)
            //alert("아이디와 비밀번호를 확인해주세요")

        }
    }

    handleEmailChange = (e) => {

        const idReg = /^[a-z0-9]*$/;
        if (e.target.value === '' || idReg.test(e.target.value)) {
            this.setState({ Userid: e.target.value });
        }
    }

    handlePasswordChange = (e) => {
        const idReg = /^[A-Za-z0-9]*$/;
        if (e.target.value === '' || idReg.test(e.target.value)) {
            this.setState({ Userpassword: e.target.value })
        }


        // let value = e.target.value
        // value = value.replace( /^[A-Za-z0-9+]*$/ig, '')
        // this.setState({Userpassword:value});
    }

    handleIngameNameChange = (e) => {
        this.setState({ user_ingameID: e.target.value });
    }

    handleIngameCodeChange = (e) => {
        this.setState({ user_ingamecode: e.target.value });
    }

    handleServerNumberChange = (e) => {
        this.setState({ server_number: e.target.value });
    }

    handleRuinable = () =>{
      this.setState({makeruinable:!this.state.makeruinable})
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

    onClickMakeAlliance = async text => {
        try {
            console.log(this.state)
            var ruinableset = this.state.makeruinable === false ? 0 : 1
            const response = await axios.patch('userresponse/', qs.stringify({
                'mode': "ALLIANCE_management", 'mode_type': "make"
                , 'ruin_basetime': this.state.makeruin_basetime, 'max_capacity': this.state.makemax_capacity,
                'ruinable': ruinableset, 'alliance_name': this.state.makealliance_name, 'server_number': this.state.server_number,
                'altar_basetime': this.state.makealtar_basetime
            })
            );
            console.log(response)
            if (response.status === 201) {
                alert(this.props.t("notice.MakeSuccess"))
                window.location.reload();
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
          const itmes = []
          if (response.status === 201) {
            if (response.data.info.length === 0) {
              this.setState({ allianceFlag: -1 })
    
            } else {
            this.setState({ allianceFlag: 1 })
              const singleItem = response.data.info
              let modifyAlliance = [];
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
                modifyAlliance.push(true)
              })
              this.setState({ alliance: singleItem , modifyAlliance:modifyAlliance})
            }
    
          } else if (response.status) {
            console.log(response)
          }
        } catch (error) {
          this.setState({ flag: 2 })
          console.log(error)
          //alert(this.props.t("notice.ServerNotConnected"))
          //TODO
          // window.location.href = '/'
        }
    
      }

      




    render() {

      console.log(this.state.makeruinable)
        const { t } = this.props;

        let divItems = this.state.alliance.map((item, index) => {
            return <div className="selectBox">
              <div  key={item.id}>{`(${index + 1}) ` + item.alliance_name}
                <div>
                  {this.state.modifyAlliance[index] === false && (
                    alliancedata([this.onClickModifyAlliance, this.onClickDeleteAlliance], "modify", [item.alliance_name, item.max_capacity, item.ruinable, item.ruin_basetime, item.altar_basetime], index)
                  )}
                </div>
              </div>
      
              {this.state.modifyAlliance[index] && <modifyButton onClick={() => 
              {
                const modifyAlliance = [...this.state.modifyAlliance]; // 배열을 복사
                // 기존의 값들을 복사하고, checked 값을 덮어쓰기
                modifyAlliance[index] = !modifyAlliance[index];
              this.setState({
                modifyAlliance: modifyAlliance
              })}}>
                {this.state.modifyAlliance[index] ? t("setbuff.ModifyAllon") : t("setbuff.ModifyAlloff")}
              </modifyButton>}

              {!this.state.modifyAlliance[index] && <modifyButton2 onClick={() => 
              {
                const modifyAlliance = [...this.state.modifyAlliance]; // 배열을 복사
                // 기존의 값들을 복사하고, checked 값을 덮어쓰기
                modifyAlliance[index] = !modifyAlliance[index];
              this.setState({
                modifyAlliance: modifyAlliance
              })}}>
                {this.state.modifyAlliance[index] ? t("setbuff.ModifyAllon") : t("setbuff.ModifyAlloff")}
              </modifyButton2>}
            </div>
      
          });

        const {
            onClickRegister, handleEmailChange, handlePasswordChange, handleIngameCodeChange, handleIngameNameChange,
            handleServerNumberChange, handleSimpleStateChange, onClickDeleteAlliance, onClickMakeAlliance, onClickModifyAlliance,handleRuinable
        } = this

        function alliancedata(methodOnClick, textForButton, state, index) {
            return <section className="form-wrapper">
                <div className="inputBox2">
                    <p style={{ fontSize: 14 }}>{t("setbuff.Allname")}</p>
                    <input id={state[0]} type="text" onChange={(e) => handleSimpleStateChange("alliance_name", e, textForButton, index)} placeholder={state[0]} />
                </div>
                <div className="inputBox2 ">
                    <p style={{ fontSize: 14 }}>{t("setbuff.Allcap")}</p>
                    <input id={state[0]} type="number" onChange={(e) => handleSimpleStateChange("max_capacity", e, textForButton, index)} placeholder={state[1]} />
                </div>
                <div className="inputBox2">
                    <p style={{ fontSize: 14 }}>{t("setbuff.Allruinable")}
                        <input id={state[0]} type="checkbox" onChange={(e) => handleRuinable()} checked={state.makeruinable}/>
                    </p>
                </div>
                <div className="inputBox2">
                    <p style={{ fontSize: 14 }}>{t("setbuff.Allruinstarttime")}</p>
                    <input id={state[0]} type="datetime-local" onChange={(e) => handleSimpleStateChange("ruin_basetime", e, textForButton, index)} placeholder={state[3]} />
                </div>
                <div className="inputBox2">
                    <p style={{ fontSize: 14 }}>{t("setbuff.Allaltarstarttime")}</p>
                    <input id={state[0]} type="datetime-local" onChange={(e) => handleSimpleStateChange("altar_basetime", e, textForButton, index)} placeholder={state[4]} />

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


        console.log(divItems)

        return (

            <main className="Register2">
                <div className="title3">
                    {t("allianceList")}
                </div>
                <section className="form-wrapper">
        {this.state.allianceFlag===-1 && <p style = {{textAlign:"center", color:"#808080"}}>{t("allianceList_none")}</p>}
                    {divItems}
                    {/* <div className="create-button" onClick={onClickRegister}>
                        {t("register")}
                    </div> */}
                    <div className="create-button" onClick={() => this.setState({ makeAlliance: !this.state.makeAlliance })}>
                        {this.state.makeAlliance ? t("setbuff.makeAllon") : t("setbuff.makeAlloff")}
                    </div>
                </section>
                <div>
                    {this.state.makeAlliance === false && (
                        alliancedata([onClickMakeAlliance], "make", ["연맹이름", 0, false, '', '']))}
                </div>
            </main>

        )
    }
}

export default withTranslation()(AllianceSetting);;
