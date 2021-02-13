import React, { Component } from 'react'
import './Update.css';
import axios from '../api'



export default class Update extends Component {
  state = { board: [] }
  MovetoContent = (article, number) => {
    window.location.href = `/board_content/${number}`
  }

  componentDidMount() {
    this.getBoardList();
  }


  getBoardList = async text => {
    try {
      console.log(this.props)

      const response = await axios.get('boardresponse/', {
        params: {
          'mode': "ServerBoard_list",'mode_type':'main'
        }
      }
      );
      console.log(response)
      console.log(response.data.info.title + ":" +response.data.info.serverboard_code)
      if (response.status === 201) {
        const item = []
        console.log(response.data.info.length)
        for (var i = 0; i < response.data.info.length; i++) {
          item.push({ number: i + 1, title: response.data.info[i].title, article: response.data.info[i].article, type: response.data.info[i].article_type })
        }
        this.setState({ board: item })
      }

    } catch (error) {

    }
  }

  render() {
    console.log(this.state.board)
    let divItems = this.state.board.map((item, index) => {
      //console.log(item.article)
      return (
        <tr  key={index + 1} onClick={() => this.MovetoContent(item.article, item.number)}>
          <td>{index + 1}</td>
          <td>{item.title}</td>
          <td>{item.type}</td>
        </tr>)

      // <div className="selectBox2" key={item.id}>{`(${index + 1}) ` + item.name} <span>{item.server}</span></div>
    });

    return (
      <div className="margin_table">
        <container>
          <table responsive hover>
            <thead>
              <br />
              <tr>
                <th width="50">#</th>
                <th>TITLE</th>
                <th>TYPE</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "center", verticalAlign: "middle", alignItems: "center", wordBreak: "break-all", fontSize: "0.9rem" }}>
              {divItems}
            </tbody>

          </table>


        </container>
      </div>
    )
  }
}
