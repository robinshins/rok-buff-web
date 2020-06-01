import React, { Fragment, Component } from 'react';
import axios from '../api';
import https from 'https';
import './SetBuff.css';
import qs from 'qs';
import { Redirect } from 'react-router';
import {withTranslation,useTranslation} from "react-i18next";
import i18n from "i18next";

class Home extends Component {
  
  state = {duke_time:0 , scientist_time:0, architecture_time: 0};



    
  onClickLogin = async text => {
    try{
    const response = await axios.patch('userresponse/', qs.stringify({
         'mode': "SERVER_management", 'mode_type': "info", 'kvk_number':"66","server_number":1525
         , 'scientist_time':this.state.scientist_time, 'duke_time':this.state.duke_time, 'architect_time':this.state.architecture_time
      })
      );
      console.log(response.data)
      if(response.status===200){
        alert("change success")
        //window.location.href = '/buffmain'
      }else{
       
      }

    }catch(error){
      alert("change fail")
      //alert("아이디와 비밀번호를 확인해주세요")

    }
      //console.log(response.data)
   
      //this.setState({ images: response.data.result });
  }

  handleDukeChange = (e) => {  
    this.setState({duke_time: e.target.value});
 }

 handleSciChange = (e) => {  
  this.setState({scientist_time: e.target.value});
}

handleArcChange = (e) => {  
  this.setState({architecture_time: e.target.value});
}
 



  render() {
    const { t } = this.props;
    if (this.state.redirect) {
      return <Redirect push to={`/buffmain/${this.state.userinfo.name}/${this.state.userinfo.x}/${this.state.userinfo.y}`} />;
    }

    const {
onClickLogin,handleArcChange,handleDukeChange,handleSciChange
    } = this;

    return (
      <main className="Home2">
        <div className="title2">
          Buff Setting
          </div>
        <section className="form-wrapper">
          <div className="inputBox2 ">
            <p style={{fontSize:14}}>duke rotation time</p>
            <input id="Username"  type = "number"value ={this.state.Userid}  onChange = {handleDukeChange} placeholder= {"#secs"}  />
          </div>
          <div className="inputBox2">
            <p style={{fontSize:14}}>scientist rotation time</p>
            <input id="Username" type = "number" value ={this.state.Userid}  onChange = {handleSciChange} placeholder= {"#secs"}  />
          </div>
          <div className="inputBox2">
            <p style={{fontSize:14}}>architecture rotation time</p>
            <input id="Username"  type = "number" value ={this.state.Userid}  onChange = {handleArcChange} placeholder= {"#secs"}  />
          </div>
          <div className="create-button" onClick={onClickLogin}>
          {"apply"}
      </div>
      { this.state.flag === 2 && <p style = {{color:'#ff4040', textAlign:'center'}}> {t("error.wrongid")}</p>}
        </section>
      </main>
      
    );
  }

}
export default  withTranslation()(Home);;