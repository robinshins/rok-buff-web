import React, { Fragment, Component, useState } from 'react';
import Http from '../api';
import './UserManagement.css';
import qs from 'qs';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";


class UserManagement extends Component {
  state = { items: [], flag: '', is_admin: sessionStorage.isadmin};



  componentDidMount() {
    console.log(this.props)
    console.log(this.state.is_admin)
    this.getRuinResult();
  }

  handleDeleteclick = async (user_code) => {
    console.log(user_code)
     // const code = this.state.items[index].user_code
     // console.log(code);
    console.log("sadasd")
    try {
        const response = await Http.delete('userresponse/', {data:qs.stringify({
            user_code: user_code
        })}
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
          console.log(error)
        alert("delete fail, server error")
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
        console.log(response)
        let date = new Date(singleItem.ruintime)
        console.log(date.toString())
        const item = []
        for (var i = 0; i < response.data.info.length; i++) {
          item.push({ name: response.data.info[i].user_ingameID, user_code:response.data.info[i].user_code,
             user_ingameCode:response.data.info[i].user_ingamecode})
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

  

  render() {
    const { t } = this.props;
    const {
      handleDeleteclick
    } = this;

    let divItems = this.state.items.map((item, index) => {
        return <div className="selectBox2" key={item.user_code}>{`(${index + 1}) ` + item.name} 
        <p className="usercode">({item.user_ingameCode})</p>
         <button class="x-box"  onClick={()=>handleDeleteclick(item.user_code)}>
          {t("member.delete")}
      </button>
      </div>
 

    });

    return (
      <main className="Home">
        <div className="title2">
          Results
          </div>
        <p style={{ textAlign: "center" }}>{t("findmember.info")} </p>
        <section className="form-wrapper">
          {divItems}

        </section>
      </main>

    );
  }

}
export default withTranslation()(UserManagement);