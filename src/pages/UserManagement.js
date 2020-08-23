import React, { Fragment, Component, useState } from 'react';
import Http from '../api';
import './UserManagement.css';
import qs from 'qs';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";


class UserManagement extends Component {
  state = { items: [], flag: '', is_admin: sessionStorage.isadmin, isTab0: 0, waitingItems: [], search: "" };



  componentDidMount() {
   // console.log(this.props)
   // console.log(this.state.is_admin)
    this.getRuinResult();
    this.getApprovalList();
  }

  handleDeleteclick = async (user_code) => {
   // console.log(user_code)
    // const code = this.state.items[index].user_code
    // console.log(code);
    //console.log("sadasd")
    try {
      const response = await Http.delete('userresponse/', {
        data: qs.stringify({
          user_code: user_code
        })
      }
      );
      //console.log(response)
      if (response.status === 200) {
        alert("delete success")
        window.location.reload()
      } else if (response.status) {
        alert("delete fail")
      //  console.log(response)
      }

    } catch (error) {
      //console.log(error)
      alert("delete fail, server error")
    }
  }


  handleApprove = async (user_code) => {
   // console.log(user_code)
    try {
      const response = await Http.patch('userresponse/', qs.stringify({
        'mode': 'USER_management', 'mode_type': 'check_USER',
        'user_code': user_code
      })
      );

      // console.log(response)
      if (response.status === 201) {
        localStorage.username = JSON.stringify(this.state.name)
        localStorage.usercode = this.state.code
        localStorage.password = JSON.stringify(this.state.password)
        window.location.reload()
        alert("success")
      } else {
       // console.log(response)
      }

    } catch (error) {
      alert(this.props.t("notice.ServerNotConnect"))
      console.log(error)
    }
  }


  getApprovalList = async text => {
    try {
      const response = await Http.get('userresponse/', {
        params: {
          mode: 'SERVER_member_list', mode_type: 'checked'
        }
      }
      );
      //console.log(response)
      if (response.status === 201) {
        const singleItem = response.data.info[response.data.info.length - 1]
        //console.log(response)
        let date = new Date(singleItem.ruintime)
       // console.log(date.toString())
        const item = []
        for (var i = 0; i < response.data.info.length; i++) {
          item.push({
            name: response.data.info[i].user_ingameID, user_code: response.data.info[i].user_code,
            user_ingameCode: response.data.info[i].user_ingamecode, userWebId: response.data.info[i].account
          })
        }
        this.setState({ waitingItems: item })
      //  console.log(this.state.waitingItems)
      } else if (response.status) {
       // console.log(response)
      }

    } catch (error) {
      this.setState({ flag: 2 })
    }

  }

  getRuinResult = async text => {
    try {
      const response = await Http.get('userresponse/', {
        params: {
          mode: 'SERVER_member_list'
        }
      }
      );
      if (response.status === 201) {
        const singleItem = response.data.info[response.data.info.length - 1]
       // console.log(response.data)
        let date = new Date(singleItem.ruintime)
       // console.log(date.toString())
        const item = []
        for (var i = 0; i < response.data.info.length; i++) {
          item.push({
            name: response.data.info[i].user_ingameID, user_code: response.data.info[i].user_code,
            user_ingameCode: response.data.info[i].user_ingamecode, userWebId: response.data.info[i].account
          })
        }
        this.setState({ items: item })
        //console.log(this.state.items)
      } else if (response.status) {
       // console.log(response)
      }

    } catch (error) {
      this.setState({ flag: 2 })
    }

  }

  handleTabChange = (id) => {
    this.setState({
      isTab0: id
    })
  }

  handleChange = (e) => {
   // console.log(e.target.value)
    this.setState({ search: e.target.value });
  }



  render() {
    var nameitems = this.state.items
    let inputword = this.state.search.trim().toLowerCase();
    if (inputword.length > 0) {
      //const namelist = this.state.items;
      nameitems = nameitems.filter(val => val.name.toLowerCase().match(inputword))
      //console.log(inputword)
      //this.setState({items:this.state.items.filter(val => val.name.toLowerCase().match(inputword))}) 
    }
    const { t } = this.props;
    const {
      handleDeleteclick, handleApprove
    } = this;

    let divItems = nameitems.map((item, index) => {
      return <div className="selectBox2" key={item.user_code}>{`(${index + 1}) ` + item.name}
        <p className="usercode">({item.userWebId})</p>
        <button class="x-box" onClick={() => handleDeleteclick(item.user_code)}>
          {t("member.delete")}
        </button>
      </div>
    });

    let waitItems = this.state.waitingItems.map((item, index) => {
      return <div className="selectBox2" key={item.user_code}>{`(${index + 1}) ` + item.name}
        <p className="usercode">({item.userWebId})</p>
        <button class="x-box" onClick={() => handleApprove(item.user_code)}>
          {t("member.approve")}
        </button>
      </div>


    });

    let memberList = () => {

      return (
        <section className="form-wrapper">
          <div style={{textAlign:"center",marginBottom:"40px",marginTop:"30px"}}>
            <input
              value={this.state.search}
              onChange={this.handleChange}
              type="text"
              placeholder="Search Users" 
              style={{height:"30px", width:"65%", borderRadius:"5px",fontWeight:"bold"}}
              />
            <ul>
              {waitItems.map(name => <li>{name}</li>)}
            </ul>
          </div>
          {divItems}
        </section>)
    }

    let waitList = () => {
      if (this.state.waitingItems.length === 0) {
        return (
          <section className="form-wrapper">
            <p style={{ textAlign: "center", marginTop: "50px", color: "grey" }}>Empty</p>
          </section>)
      } else {

        return (
          <section className="form-wrapper">
            {waitItems}
          </section>)
      }
    }


    return (
      <main className="Home">
        <div className="title" onClick={() => this.handleTabChange(0)}>
          {t("member_management.list")}
        </div>
        <div className="title" onClick={() => this.handleTabChange(1)}>
          {t("member_management.approve")}
        </div>

        {this.state.isTab0 === 0 && memberList()}
        {this.state.isTab0 === 1 && waitList()}
      </main>

    );
  }

}
export default withTranslation()(UserManagement);