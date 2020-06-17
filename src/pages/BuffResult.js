import React, { Fragment, Component, useState } from 'react';
import axios from '../api';
import './BuffResult.css';
import qs from 'qs';

class BuffResult extends Component {
  //this component requires:
  //ttype: title_type
  state = {
    items: [], flag: '', is_admin: '', x: localStorage.xcoor,
    y: localStorage.ycoor, lostkingdom: this.props.location.state.lostkingdom,
    titleType: this.props.location.state.titleType, name: this.props.location.state.name.replace(/\"/g,'')
  };

  myrank=0


  componentDidMount() {
    console.log(this.props)
    this.getRuinResult();
      if(sessionStorage.id !== undefined && sessionStorage.password !==undefined){
    console.log(sessionStorage.id.replace(/\"/g, ''))
  this.signIn(sessionStorage.id.replace(/\"/g, ''),sessionStorage.password.replace(/\"/g, ''))
  }
    console.log(this.state) 
  }

  
  signIn = async ( email, password )=> {
    try {
      const response = await axios.patch('loginresponse/', qs.stringify({
        'mode': "login", 'password':password , 'account': email
      })
      );
      console.log(response.data)
      if (response.status === 200) {
        localStorage.xcoor = JSON.stringify(response.data.info.account.x)
        localStorage.ycoor = JSON.stringify(response.data.info.account.y)
      } else {
       
      }

    } catch (error) {
      console.log(error.response)
    
    }
  
}


  getRuinResult = async text => {
    try {
      console.log(this.props)

      const response = await axios.get('qresponse/', {
        params: {
          'mode': "get_MYQ", 'dat_time': "1900-01-01 00:00:00.00+00:00", 'title_type': this.state.titleType
        }
      }
      );
      console.log(response)
      if (response.status === 200) {
        const singleItem = response.data.info[response.data.info.length - 1]
        console.log(response)
        let date = new Date(singleItem.ruintime)
        console.log(date.toString())
        const item = []
        for (var i = 0; i < response.data.info.length; i++) {
          item.push({ name: response.data.info[i][2], server: response.data.info[i][1] })
        }
        this.setState({ items: item })
        
        console.log(this.state.items)
      } else if (response.status) {
        console.log(response)

      }

    } catch (error) {
      this.setState({ flag: 2 })
    }
  }
  
  handleDone = () =>{
    window.location.href='/buffmain/'
  }

  render() {
    let bgColor = this.state.lostkingdom === false ? "#origin kingdom" : "#The Lost Kingdom"
    let titletype = this.state.titleType === 1 ? "duke" : this.state.titleType === 2 ? "scientist" : "architect"
    //let myrank
    let divItems = this.state.items.map((item, index) => {
      console.log(item.name)
      console.log(this.state.name)
      if(item.name === this.state.name){this.myrank = index +1}
      return <div className="selectBox2" key={item.id}>{`(${index + 1}) ` + item.name} <span>{item.server}</span></div>
    });


  
  //  let myrank = this.state.items.findIndex(item => item.name === this.state.name)+1
  //  console.log(this.state.items)
  console.log(this.myrank)
    

    return (
      <main className="Home">
        <div className="title2">
          register complete          </div>
        <ul class="collection">

          <li class="collection-item">

            <div class="row">
              <p><span class="text-role">title</span> : {titletype}</p>{bgColor}
              <p><span class="text-coord">coordinate</span>  X:{this.state.x} Y:{this.state.y}</p>
              <p><span class="text-wait">wait</span> : {this.myrank}/{this.state.items.length}</p>
              <div className="selectKingdom">
                <box className="create-button" style={{ backgroundColor: "#87ceeb", color: "#ffffff" }} onClick={() =>this.handleDone()}>
                  DONE</box>
                <box className="create-button" style={{ backgroundColor: "#87ceeb", color: "#ffffff" }} onClick={() => window.location.reload()}>
                  reload</box>

              </div>
            </div>
          </li>
        </ul>
        <div className="title2">
          Waiting List
          </div>
        <section className="form-wrapper">
          {divItems}
        </section>
      </main>

    );
  }

}
export default BuffResult;