import React, { Fragment, Component,useState } from 'react';
import Http from '../api';
import './RuinApply.css';
import qs from 'qs';

class RuinApply extends Component {
  state = { items : [], flag:'',is_admin:this.props.match.params.isadmin};
    
componentDidMount() { 
  this.getRuintime();
  console.log('constructor') 
}


  getRuintime = async text => {
    try{
    const response = await Http.get('userresponse/', {params:{
         mode:'RUIN_time'
      }}
      );
      if(response.status===201){
     
        if(response.data.info.length === 0){
          this.setState({flag : -1})
        }else{
        const singleItem = response.data.info[response.data.info.length-1]
        console.log(response)
        let date = new Date(singleItem.ruintime)
        //date.setHours(date.getHours()+9)
        console.log(date.toString())
        //const newitems = [...this.state.items]
        const item = [{id:singleItem.ruintime_code, time:singleItem.ruintime.substring(0,10) + " "+singleItem.ruintime.substring(11,19),checked:false,koreaTime:date.toString().substring(15,25)}]
        this.setState({items : item})
        console.log(this.state.items)
      }
    }else if(response.status){
      console.log(response)
    }

    }catch(error){
      this.setState({flag : 2})
    }

  }

  handleTimeClick = (e,id) => {
    const { items } = this.state;
  

    // 파라미터로 받은 id 를 가지고 몇번째 아이템인지 찾습니다.
    const index = items.findIndex(item => item.id === id);
    const selected = items[index]; // 선택한 객체
    const nextItems = [...items]; // 배열을 복사
    // 기존의 값들을 복사하고, checked 값을 덮어쓰기
    nextItems[index] = { 
      ...selected, 
      checked: !selected.checked
    };

    this.setState({
      items: nextItems
    });
}


handleApplyclick = async text => {
  console.log(this.state.flag)
  if(this.state.flag===-1){
    
  }else{
  if(this.state.items[0].checked){
  try{
  const response = await Http.patch('userresponse/', qs.stringify({
       'mode': 'RUIN_register', 'ruintime_code': this.state.items[0].id 
    })
    );
    console.log(response)
    if(response.status===201){
      alert("apply success")
      window.location.href = `/ruinresult/${this.state.items[0].id}/${this.state.is_admin}`
    }else{
       alert("apply failed")
       window.location.href = `/ruinresult/${this.state.items[0].id}/${this.state.is_admin}`
    }

  }catch(error){
    if (error.response.status === 406){
      alert("already registered or full")
      window.location.href = `/ruinresult/${this.state.items[0].id}/${this.state.is_admin}`
   }
   window.location.href = `/ruinresult/${this.state.items[0].id}/${this.state.is_admin}`
    console.log(error.response)
    //console.log(response.error)
    //alert("아이디와 비밀번호를 확인해주세요")

  }
}else{
  this.setState({flag : -2})
}
}
}

  render() {
    const {
      getRuintime,handleEmailChange,handlePasswordChange,handleTimeClick,handleApplyclick
    } = this;

    let divItems = this.state.items.map((item) => {
      console.log(item.checked)
      if(item.checked){
        return <div className="selectBox" key={item.id} style={{ backgroundColor: "#87ceeb", color: "#ffffff" }} onClick = {(event) => handleTimeClick(event,item.id)}>{"UTC : "+item.time}<br />{"Korea time : "+item.koreaTime}</div>

      }else{
      return (<div className="selectBox" key={item.id}  onClick = {(event) => handleTimeClick(event,item.id)}>{"UTC : "+item.time}<br />{"Korea time : "+item.koreaTime}</div>)

      }
   });

    return (
      <main className="Home">
        <div className="title2">
          Choose time
          </div>
        <section className="form-wrapper">
          {divItems}
          { this.state.flag === -1 && <p style = {{color:'#ff4040', textAlign:'center'}}> There is no available time</p>}
          { this.state.flag === -2 && <p style = {{color:'#ff4040', textAlign:'center'}}> select time first</p>}
          <div className="create-button" onClick = {handleApplyclick}>
            apply 
      </div>
        </section>
      </main>
      
    );
  }

}
export default RuinApply;