import React, { Fragment, Component,useState } from 'react';
import Http from '../api';
import './RuinResult.css';
import qs from 'qs';
import {withTranslation,useTranslation} from "react-i18next";
import i18n from "i18next";


class RuinResult extends Component {
  state = { items : [], flag:'',is_admin:sessionStorage.isadmin};

 
    
componentDidMount() { 
  console.log(this.props)
  console.log(this.state.is_admin)
  this.getRuinResult();
}

handleDeleteclick = async text => {
  console.log(text.target)
//   if(this.state.is_admin===1){
//   try{
//   const response = await Http.delete('userresponse/', qs.stringify({
//        'mode': 'RUIN_register', 'ruintimeregister_code': e. 
//     })
//     );
//     console.log(response)
//     if(response.status===201){
//       alert("delete success")
//     }else{
//        alert("delete failed")
//     }

//   }catch(error){
//     alert("delete failed")
//     console.log(error.response)
//     //console.log(response.error)
//     //alert("아이디와 비밀번호를 확인해주세요")

//   }
// }else{
  
// }
}


  getRuinResult = async text => {
    try{
    const response = await Http.get('userresponse/', {params:{
         mode:'RUIN_member_list', ruintime_code: this.props.match.params.ruintimecode
      }}
      );
      if(response.status===201){
        const singleItem = response.data.info[response.data.info.length-1]
        console.log(response)
        let date = new Date(singleItem.ruintime)
        console.log(date.toString())
        const item = []
        for(var i = 0 ;  i< response.data.info.length ; i++){
          item.push({name: response.data.info[i]})
        }
        this.setState({items : item})
        console.log(this.state.items)
      }else if(response.status){
        console.log(response)
      }

    }catch(error){
      this.setState({flag : 2})
    }

  }

  render() {
    const { t } = this.props;
    const {
      getRuintime,handleEmailChange,handlePasswordChange,handleTimeClick,handleApplyclick,handleDeleteclick
    } = this;

    let divItems = this.state.items.map((item,index) => {
      if(this.state.is_admin===JSON.stringify(1)){
        return <div className="selectBox2" key={item.id}>{`(${index+1}) `+item.name} <div class="x-box" id ={index} onClick={handleDeleteclick}>
        X
      </div></div>
      }else{
        return <div className="selectBox2" key={item.id}>{`(${index+1}) `+item.name}</div>
      }

   });

    return (
      <main className="Home">
        <div className="title2">
          Results
          </div>
          <p style= {{textAlign:"center"}}>{t("apply.info")} </p>
        <section className="form-wrapper">
          {divItems}
          <div className="create-button" onClick = {event =>  window.location.href = '/'}>
            okay 
      </div>
        </section>
      </main>
      
    );
  }

}
export default  withTranslation()(RuinResult);