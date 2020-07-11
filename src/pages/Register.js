import React, { Fragment, Component } from 'react';
import './Register.css';
import Http from '../api';
import qs from 'qs';
import {withTranslation,useTranslation} from "react-i18next";
import i18n from "i18next";


class Register extends Component{
    state = { Userid: '', Userpassword:'',flag:'',user_ingamecode:'0',user_ingameID:'',server_number:'',value:''};

 
    
    onClickRegister = async text => {
        try{
        const response = await Http.post('userresponse/', qs.stringify({
             'server_number': this.state.server_number, 'password': this.state.Userpassword, 
             'account':this.state.Userid,'user_ingamecode':this.state.user_ingamecode , 'user_ingameID':this.state.user_ingameID
          })
          );
          if(response.status===201){
            window.location.href = '/'
          }else{
              console.log(response)
          }
    
        }catch(error){
            if(error.response != null){
            if(error.response.status === 409){
                this.setState({flag : 2})
            }else if(error.response.status === 404){
                this.setState({flag : 1})
            }else{
               
            }
        }else{
            this.setState({flag : 3})
        }
          console.log(error)
          //console.log(response.error)
          //alert("아이디와 비밀번호를 확인해주세요")
    
        }
      }

      handleEmailChange = (e) => {
     
        const idReg =  /^[a-z0-9]*$/ ;  
        if (e.target.value === '' || idReg.test(e.target.value)) {
            this.setState({Userid: e.target.value});
         }
     }
     
     handlePasswordChange = (e) => {
        const idReg =  /^[A-Za-z0-9]*$/ ;  
        if (e.target.value === '' || idReg.test(e.target.value)) {
            this.setState({Userpassword: e.target.value})
         }


        // let value = e.target.value
        // value = value.replace( /^[A-Za-z0-9+]*$/ig, '')
        // this.setState({Userpassword:value});
     }

     handleIngameNameChange = (e) => {
        this.setState({user_ingameID: e.target.value});
     }
     
     handleIngameCodeChange = (e) => {
        this.setState({user_ingamecode: e.target.value});
     }

     handleServerNumberChange = (e) => {
        this.setState({server_number: e.target.value});
     }



    render(){
        const { t } = this.props;

        const {
            onClickRegister,handleEmailChange,handlePasswordChange,handleIngameCodeChange,handleIngameNameChange,handleServerNumberChange
                } = this
    return (

        <main className="Register">
            <div className="registerTitle">
            {t("register")}
          </div>
          <section className = "form-wrapper">

            <div className="password3">
                <input id="Username" value ={this.state.Userid}  onChange = {handleEmailChange} placeholder= {t("id")} />
            </div>
            <div className="password3">
                <input type='text' id="Userpassword" value ={this.state.Userpassword}   onChange = {handlePasswordChange} placeholder= {t("password")} />
            </div>
            <div className="password3">
                <input type='text' id="UserNickName" value ={this.state.user_ingameID}  onChange = {handleIngameNameChange} placeholder= {t("ingameNickName")} />
            </div>
            <div className="password3">
                <input type='number' id="UserServerId" value ={this.state.server_number}  onChange = {handleServerNumberChange} placeholder= {t("serverNumber")} />
            </div>
            <div className="create-button" onClick = {onClickRegister}>
            {t("register")}
            </div>
            <div className="create-button" onClick = {event =>  window.location.href='/'}>
            {t("cancel")}
            </div>
            { this.state.flag === 2 && <p style = {{color:'#ff4040', textAlign:'center'}}>{t("error.existingID")}</p>}
            { this.state.flag === 1 && <p style = {{color:'#ff4040', textAlign:'center'}}>{t("error.serverExisting")}</p>}
            { this.state.flag === 3 && <p style = {{color:'#ff4040', textAlign:'center'}}>Server error</p>}
            </section>
        </main>

    )
}
}

export default  withTranslation()(Register);;
