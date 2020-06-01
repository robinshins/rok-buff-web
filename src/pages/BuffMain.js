import React, { Fragment, Component } from 'react';
import './BuffMain.css';
import axios from '../api';
import https from 'https';
import qs from 'qs';
import { Redirect } from 'react-router';
import {withTranslation,useTranslation} from "react-i18next";
import i18n from "i18next";

class BuffMain extends Component {
    state = { x: this.props.match.params.x, y: this.props.match.params.y, ischeck0: false, ischeck1: false, ischeck2: false, lostkingdom: false, backgroundColor: '', textcolor: '' ,titleType:-1,is_kvk:0,duke_wait:null,scientist_wait:null,architecture_wait:null};


    componentDidMount = () =>{
        this.getWaitingList();
    }


    handleGongzakChange = (e) => {
        this.setState({ backgroundColor: '#87ceeb', textcolor: '#ffffff', ischeck0: true, ischeck1: false, ischeck2: false,titleType:1 });
    }


    handleScientistChange = () => {
        this.setState({ backgroundColor: '#87ceeb', textcolor: '#ffffff', ischeck1: true, ischeck0: false, ischeck2: false ,titleType:2});
        //this.setState({Userid: e.target.value});
    }

    handleArchitectureChange = () => {
        this.setState({ backgroundColor: '#87ceeb', textcolor: '#ffffff', ischeck2: true, ischeck1: false, ischeck0: false ,titleType:3});
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
        this.setState({ backgroundColor: '#87ceeb', textcolor: '#ffffff', lostkingdom: true ,is_kvk:1});
        //this.setState({Userid: e.target.value});
    }

    handleKingdomChange2 = () => {
        this.setState({ backgroundColor: '#87ceeb', textcolor: '#ffffff', lostkingdom: false ,is_kvk:0});
        //this.setState({Userid: e.target.value});
    }

    handleSubmit = async text => {
        console.log(this.state);
        if(this.state.titleType!==-1){
        try{
        const response = await axios.post('qresponse/', qs.stringify({
             'mode': "TitleQ_request", 'user_x': this.state.x, 'user_y':this.state.y, 'title_type':this.state.titleType , 'is_kvk':this.state.is_kvk,
          })
          );
          console.log(response)

          if(response.status===201){
            alert("success")
            window.location.href = `/buffresult/${this.state.titleType}`
          }else{
              
          }
    
        }catch(error){
            alert("fail")
          console.log(error.response)
          //this.setState({flag : 2})
          //alert("아이디와 비밀번호를 확인해주세요")
    
        }
    }else{
        alert("받을 칭호를 먼저 선택해주세요")
    }
          //console.log(response.data)
       
          //this.setState({ images: response.data.result });
      }

      getWaitingList = async text => {
        try{
        const response = await axios.get('qresponse/',{params:{
            'mode': "get_QCOUNT"
         }}
          );
          console.log(response.data.info)
          if(response.status===200){
            this.setState({duke_wait:response.data.info[0][0]})
            this.setState({scientist_wait:response.data.info[2][0]})
            this.setState({architecture_wait:response.data.info[1][0]})
            //window.location.href = '/buffmain'
          }else{
              
          }
    
        }catch(error){
          console.log(error.response)
          //this.setState({flag : 2})
          //alert("아이디와 비밀번호를 확인해주세요")
    
        }
    }
          //console.log(response.data)
       
          //this.setState({ images: response.data.result });
      





    render() {
        const { t } = this.props;
        const { changeColor, handleGongzakChange } = this;
        let bgColor = this.state.color_black ? this.props.color : this.props.color2
        return (
            <main className="BuffMain">
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
                    <div className="create-button"onClick={this.handleSubmit}>
                    {t("buff.apply")}
            </div>
                </section>
            </main>
        )
        console.log("sadasd")
    }
}

export default withTranslation()(BuffMain);;