import React, { Fragment, Component, useState, useEffect } from 'react';
import Http from '../api';
import './Roktest.css';
import qs from 'qs';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";
import ScrollToBottom from 'react-scroll-to-bottom';

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
        if (search.length > 0) {
            var searched = [...data]
            //const namelist = this.state.items;
            searched = searched.filter(val => val.sentence.toLowerCase().match(search))
            setSearchedsetData(searched)
            //this.setState({items:this.state.items.filter(val => val.name.toLowerCase().match(inputword))}) 
        } else {
            setSearchedsetData(data)
        }
    }, [search]);

    async function submitbad(code, bad){
        console.log(code, bad)
        try {
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

    let divItems = searcheddata.map((item, index) => {
        return <div className="databox" key={item.code}>
            <p style={{ color: "black", fontSize: "1rem" }} className="sentencebox">{item.sentence} <button onClick={()=>submitbad(item.code,item.bad)} style={{fontSize:"0.7rem",color:"#969696"}}>{t("roktest.wrong")}:{item.bad}</button></p>
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
                    server_code: sessionStorage.server_code,
                    user_name: sessionStorage.user_name.replace(/\"/g, ''),
                    text: text,
                    chatId: sessionStorage.chatId,
                    user_nickname: sessionStorage.chatNickname,
                    timestamp2: new Date().getTime(),
                }
            }
            setMessage("");
            return firebase.database().ref('/test/').push(messages);
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
        try{
            const response = await Http.post('quizresponse/', qs.stringify({
                 'sentence': newsentence, 'answer': newanswer, 
                 'bad':0,'good':0,
              })
              );
              console.log(response)
              if(response.status===200){
                alert("success")
                window.location.reload();
              }else{
              }
        
            }catch(error){
              console.log(error)
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
                <div className="answerspot">
                    {divItems}
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