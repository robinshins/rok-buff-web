import React, { Fragment, Component, useState } from 'react';
import axios from '../api';
import './BuffResult.css';
import qs from 'qs';

class BuffResult extends Component {
  //this component requires:
  //ttype: title_type
  state = { items: [], flag: '',is_admin:'' };



  componentDidMount() {
    console.log(this.props)
    this.getRuinResult();
  }


  getRuinResult = async text => {
    try {
      const response = await axios.get('qresponse/', {
        params: {
          'mode': "get_MYQ", 'dat_time': "1900-01-01 00:00:00.00+00:00", 'title_type': this.props.match.params.ttype
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
          item.push({ name: response.data.info[i][1] })
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

    let divItems = this.state.items.map((item, index) => {
      return <div className="selectBox2" key={item.id}>{`(${index + 1}) ` + item.name}</div>

    });

    return (
      <main className="Home">
        <div className="title2">
          Waiting List
          </div>
        <section className="form-wrapper">
          {divItems}
          <div className="create-button" onClick={event => window.location.href = '/'}>
            okay
      </div>
        </section>
      </main>

    );
  }

}
export default BuffResult;