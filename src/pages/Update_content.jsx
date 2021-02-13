import React, { Component } from 'react'
import './Update_content.css';
import Markdown from 'react-markdown/with-html';
import axios from '../api'

export default class Update_content extends Component {
    state = {title:"",article:""}
    boardnum = this.props.match.params.boardnum-1;
    componentDidMount(){
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
          console.log(this.boardnum)
          if (response.status === 201) {
            this.setState({ title: response.data.info[this.boardnum].title, article:response.data.info[this.boardnum].article })
          }
    
        } catch (error) {
    
        }
      }
  

    render() {
        console.log("sadsad")
        console.log(this.state.article)
        const input = '# This is a header\n\nAnd this is a paragraph'
        const source = ' <h2 style="color:black"> aa</h2> \n\n # aaaa <a href="https://en.wikipedia.org/wiki/HTML">HTML</a>  <img src="https://ifh.cc/g/FjZYQI.jpg" width="200"/> \n dasdsad **Bold** __Bold__ *Italic* _Italic_ ~~Cancel~~ \n\n <h1> dddd </h1>'
       
        // const React = require('react')
        // const ReactDOM = require('react-dom')
        // const ReactMarkdown = require('react-markdown')
        // ReactDOM.render(<ReactMarkdown source={input} />, document.getElementById('container'))
        return (
          
            <div className="containerbox">
                <container>
                    <card style={{ width: '90%', maxWidth: '1000px', height: '40rem' }}>
                        <cardBody>
                            <cardTitle className="cardTitle">{this.state.title}</cardTitle>
                            <br/><br/><br/>
                            <cardText>
                                <Markdown source = {this.state.article} escapeHtml={false} skipHtml={false}/>
                            </cardText>
                        </cardBody>
                    </card>
                    <br/>
                    <br/>
                    <br/>
                    
                </container>
            </div>
        )
    }
}
