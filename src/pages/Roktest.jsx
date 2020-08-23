import React, { Fragment, Component, useState, useEffect } from 'react';
import Http from '../api';
import './Roktest.css';
import qs from 'qs';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";
import ScrollToBottom from 'react-scroll-to-bottom';
import Popup from "reactjs-popup";
import { confirmAlert } from 'react-confirm-alert'; // Import
import { ChatFeed, Message } from 'react-chat-ui'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';

const Roktest = () => {
    const [toggle, setToggle] = useState(false);
    const [message, setMessage] = useState("");
    const [clickable, setClickable] = useState(true);
    const [chatlogs, setChatlogs] = useState([]);
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([]);
    const [searcheddata, setSearchedsetData] = useState([]);
    const [search, setSearch] = useState("");
    const [newsentence, setNewsentence] = useState("");
    const [newanswer, setNewanswer] = useState("");

    var firebase = require('firebase');
    var firebaseConfig = {
        apiKey: process.env.REACT_APP_FB_API_KEY,
        authDomain: "metal-incline-274111.firebaseapp.com",
        databaseURL: "https://metal-incline-274111.firebaseio.com",
        projectId: "metal-incline-274111",
        storageBucket: "metal-incline-274111.appspot.com",
        messagingSenderId: "587575508092",
        appId: "1:587575508092:web:0031ad6f424f79345a1df9",
        measurementId: "G-EH84K7W8W1"
    };
    var firebaseApp
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
    }


    const delayTime = () => {
        setTimeout(() => {
            setClickable(true)
        }, 1000);

    }
    useEffect(() => {
        getData();
    }, []);
    useEffect(()=>{delayTime()}, [clickable]);
     
    var messages = [
        new Message({ id: 1, message: "Start Chat!" ,senderName:'Admin'}),
    ]
    

    const onKeyPressHandler = (e)=>{
      
        if (e.key === 'Enter') {
        e.preventDefault();
        writeUserData(message);
          //console.log("dasdlkjnljknkj")
        }

    }

    useEffect(()=>{
        var ref = firebase.database().ref('roktest/');
        var now = Date.now();
        var cutoff = now - 48 * 60 * 60 * 1000;
        var old = ref.orderByChild('normal_chat/timestamp2').endAt(cutoff).limitToLast(1);
        old.on('child_added', function(snapshot) {
            //console.log(snapshot.val())
            snapshot.ref.remove()
            //snapshot.commentsRef.remove();
        });
        setChatlogs(messages)
        var commentsRef = firebase.database().ref('roktest/');
        //console.log(localStorage.timestamp)
        const time =  new Date(parseInt(localStorage.timestamp,100))
        //console.log(time.getTime())
        var foo = commentsRef.orderByChild("normal_chat/timestamp2").limitToLast(10)
        foo.on('child_added', function(data) {
        var newMessage = [...messages]
       // console.log(data.val().normal_chat)
        setChatlogs(messages)
        console.log(sessionStorage.user_name)
        if(sessionStorage.user_name!==undefined){
        if(data.val().normal_chat.user_name.replace(/\"/g, '') === sessionStorage.user_name.replace(/\"/g, '')){
            newMessage.push({id:0, message:data.val().normal_chat.text})
        
        }else{
            newMessage.push({id:data.val().normal_chat.chatId, message:data.val().normal_chat.text,senderName:data.val().normal_chat.user_nickname.replace(/\"/g, '')})
        }
    }else{
        newMessage.push({id:data.val().normal_chat.chatId, message:data.val().normal_chat.text,senderName:data.val().normal_chat.user_nickname.replace(/\"/g, '')})
    }
        setChatlogs(newMessage)
        messages = newMessage
    });
    }, []);

    const getData = async text => {

        try {
            const response = await Http.get('quizresponse/');
            if (response.status === 200) {
                const item = []
                for (var i = response.data.info.length - 1; i >= 0; i--) {
                    item.push({
                        code: response.data.info[i].quiz_code, sentence: response.data.info[i].sentence,
                        answer: response.data.info[i].answer, good: response.data.info[i].good, bad: response.data.info[i].bad
                    })
                }
                setData(item)
                setSearchedsetData(item)

            } else if (response.status) {

            }

        } catch (error) {

        }

    }
    useEffect(() => {
        try{
        if (search.length > 0) {
            var searched = [...data]
            //const namelist = this.state.items;
            searched = searched.filter(val => val.sentence.toLowerCase().match(search.toLowerCase()) ||val.answer.toLowerCase().match(search.toLowerCase()))
            setSearchedsetData(searched)
            //this.setState({items:this.state.items.filter(val => val.name.toLowerCase().match(inputword))}) 
        } else {
            setSearchedsetData(data)
        }
    }catch{}
    }, [search]);

     async function submitbad(code, bad){
        confirmAlert({
            title: 'Confirm',
            message: t("confirm.wrong"),
        
            buttons: [
              {
                label: t("yes"),
                onClick: async () =>        { try {
                    const response = await Http.patch('quizresponse/', qs.stringify({
                      'mode': 'bad', "quiz_code":code,
                    })
                    );
                    // console.log(response)
                    if (response.status === 200) {
                      window.location.reload()
                      alert("success")
                    } else {
                      console.log(response)
                    }
              
                  } catch (error) {
                    alert("fail")
                    console.log(error)
                  }
                }
              },
              {
                label: t("no"),

              }
            ]
          });
        // console.log(code, bad)


    }

    const randomnum = Math.floor(Math.random() * 1000) + 1  

    let divItems = searcheddata.map((item, index) => {
        return <div className="databox" key={item.code}>
            <p style={{ color: "black", fontSize: "1rem" }} className="sentencebox">{item.sentence}<button onClick={()=>submitbad(item.code,item.bad)} style={{fontSize:"0.7rem",color:"#969696"}}>{t("roktest.wrong")}:{item.bad}</button></p>
            <p style={{ color: "red", fontSize: "1rem" }} className="answerbox">{item.answer}</p>
        </div>
    });

    function writeUserData(text) {
        if (text !== "" && clickable) {
            setClickable(false)
            //console.log(firebase.database())
            var newPostKey = firebase.database().ref().child('/users/').push().key;
            var userinfo = {
                normal_chat: {
                    server_code: sessionStorage.server_code,
                    user_name: sessionStorage.user_name,
                    user_nickname: sessionStorage.chatNickname
                },
                admin_chat: {

                }
            }

            var messages = {
                normal_chat: {
                    server_code: sessionStorage.servernumber === undefined ? "" : sessionStorage.servernumber ,
                    user_name: sessionStorage.user_name ===undefined? "stranger"+randomnum : sessionStorage.user_name.replace(/\"/g, ''),
                    text: text,
                    chatId: sessionStorage.chatId === undefined ? "stranger"+randomnum : sessionStorage.chatId,
                    user_nickname: sessionStorage.chatNickname === undefined ? "stranger"+randomnum : sessionStorage.chatNickname,
                    timestamp2: new Date().getTime(),
                }
            }
            setMessage("");
            return firebase.database().ref('/roktest/').push(messages);
        }
    }
    const handleChange = (e) => {
        setSearch(e.target.value)
    }
    const handleSentenceChange = (e) => {
        setNewsentence(e.target.value)
    }
    const handleAnswerChange = (e) => {
        setNewanswer(e.target.value)
    }
    const onSubmit = async t => {
        if(newsentence.length >5 && newanswer.length >0){
        try{
            const response = await Http.post('quizresponse/', qs.stringify({
                 'sentence': newsentence, 'answer': newanswer, 
                 'bad':0,'good':0,
              })
              );
           //   console.log(response)
              if(response.status===200){
                alert("success")
                window.location.reload();
              }else{
              }
        
            }catch(error){
              console.log(error)
            }
        }else {
            alert("please put text first")
        }

    }

    return (
        <main className="Home">
            <div className="ruintitle">
                {t("rok.test")}
            </div>
            <section className="form-wrapper">
                <p style={{textAlign:"center",marginBottom:"20px",color:"#969696"}}>{t("roktest.info")}</p>
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <input
                        value={search}
                        onChange={handleChange}
                        type="text"
                        placeholder="Search"
                        style={{ height: "30px", width: "85%", borderRadius: "5px", fontWeight: "bold", textAlign: "center" }}
                    />
                </div>
    <p style={{textAlign:"center",fontSize:"0.7rem",color:"#969696",marginTop:"-20px"}}>{t("roktest.searchinfo")}</p>
                <div className="answerspot">
                    {divItems}
                </div>
                <br/>
                <p style={{ textAlign: "center", fontWeight: "bolder", fontSize: "1.5rem", marginBottom: "20px" }} >{t("roktest.chat")}</p>
                <p style={{ textAlign: "center", fontWeight: "bolder", fontSize: "1rem", marginBottom: "20px",color:"#969696" }} >{t("roktest.chatinfo")}</p>
                <ScrollToBottom
                            className="chat-logs"
                            >
                            <div className="chat-logs">
                                <ChatFeed
                                    messages={chatlogs} // Boolean: list of message object
                                    bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
                                    showSenderName
                                    // JSON: Custom bubble styles
                                    bubbleStyles={
                                        {
                                            text: {
                                                fontSize: 12,
                                                fontWeight:"bolder",
                                            },
                                            chatbubble: {
                                                borderRadius: 70,
                                                padding: 10
                                            },
                                        }
                                    }
                                />
                    
                            </div>
                            </ScrollToBottom>
                            <div class="chat-input2">
                            <form>
                                <input type="text" value={message} onKeyPress={(e) => onKeyPressHandler(e)} onSubmit={()=>writeUserData(message)} onChange={({ target: { value } }) => setMessage(value)} autoComplete='off' id="chat-input2" placeholder="Send a message..." />
                                <div className="chat-submit2" onSubmit={()=>writeUserData(message)} onClick={()=>writeUserData(message)} ><SendIcon></SendIcon></div>
                            </form>
                            <br/>
                        </div>
                        <p style={{ textAlign: "center", fontWeight: "bolder", fontSize: "1.5rem", marginBottom: "20px" }} >{t("newquiz")}</p>
                <div style={{ textAlign: "center" }}>
                    <input
                        value={newsentence}
                        onChange={handleSentenceChange}
                        type="text"
                        placeholder={t("sentence")}
                        style={{ marginRight: "15px", marginLeft: "-20px", height: "30px", width: "60%", fontWeight: "bold", textAlign: "center" }}
                    />
                    <input
                        value={newanswer}
                        onChange={handleAnswerChange}
                        type="text"
                        placeholder={t("answer")}
                        style={{ height: "30px", width: "30%", fontWeight: "bold", textAlign: "center" }}
                    />
                </div>
                <div className="create-button" onClick={onSubmit}>
                    {t("submit")}
                </div>
            </section>
        </main>

    );

}
export default withTranslation()(Roktest);