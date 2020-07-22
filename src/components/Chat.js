import React, { Fragment, useState, useEffect,useRef  } from 'react';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { ChatFeed, Message } from 'react-chat-ui'
import ScrollToBottom from 'react-scroll-to-bottom';
import { withTranslation, useTranslation } from "react-i18next";
import './Chat.css'

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

const CSSTransitionGroup = require('react-addons-css-transition-group');

// $(function() {
//     var INDEX = 0; 
//     $("#chat-submit").click(function(e) {
//       e.preventDefault();
//       var msg = $("#chat-input").val(); 
//       if(msg.trim() == ''){
//         return false;
//       }
//       generate_message(msg, 'self');
//       var buttons = [
//           {
//             name: 'Existing User',
//             value: 'existing'
//           },
//           {
//             name: 'New User',
//             value: 'new'
//           }
//         ];
//       setTimeout(function() {      
//         generate_message(msg, 'user');  
//       }, 1000)

//     })

//     function generate_message(msg, type) {
//       INDEX++;
//       var str="";
//       str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">";
//       str += "          <span class=\"msg-avatar\">";
//       str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
//       str += "          <\/span>";
//       str += "          <div class=\"cm-msg-text\">";
//       str += msg;
//       str += "          <\/div>";
//       str += "        <\/div>";
//       $(".chat-logs").append(str);
//       $("#cm-msg-"+INDEX).hide().fadeIn(300);
//       if(type == 'self'){
//        $("#chat-input").val(''); 
//       }    
//       $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
//     }  

//     function generate_button_message(msg, buttons){    
//       /* Buttons should be object array 
//         [
//           {
//             name: 'Existing User',
//             value: 'existing'
//           },
//           {
//             name: 'New User',
//             value: 'new'
//           }
//         ]
//       */
//       INDEX++;
//       var btn_obj = buttons.map(function(button) {
//          return  "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\""+button.value+"\">"+button.name+"<\/a><\/li>";
//       }).join('');
//       var str="";
//       str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg user\">";
//       str += "          <span class=\"msg-avatar\">";
//       str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
//       str += "          <\/span>";
//       str += "          <div class=\"cm-msg-text\">";
//       str += msg;
//       str += "          <\/div>";
//       str += "          <div class=\"cm-msg-button\">";
//       str += "            <ul>";   
//       str += btn_obj;
//       str += "            <\/ul>";
//       str += "          <\/div>";
//       str += "        <\/div>";
//       $(".chat-logs").append(str);
//       $("#cm-msg-"+INDEX).hide().fadeIn(300);   
//       $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
//       $("#chat-input").attr("disabled", true);
//     }

//     $(document).delegate(".chat-btn", "click", function() {
//       var value = $(this).attr("chat-value");
//       var name = $(this).html();
//       $("#chat-input").attr("disabled", false);
//       generate_message(name, 'self');
//     })

//     $("#chat-circle").click(function() {    
//       $("#chat-circle").toggle('scale');
//       $(".chat-box").toggle('scale');
//     })

//     $(".chat-box-toggle").click(function() {
//       $("#chat-circle").toggle('scale');
//       $(".chat-box").toggle('scale');
//     })

//   })

const Chat = () => {
    const x = 100;
    const y = 100;
    const [toggle, setToggle] = useState(false);
    const [message, setMessage] = useState("");
    const [clickable, setClickable] = useState(true);
    const [chatlogs, setChatlogs] = useState([]);
   
    const chatCirCleonclick = () => {
        //console.log(toggle)
        setToggle(!toggle);

    }
    // useEffect(() => {
    //     ()=>{scrollToBottom()}
    //     return () => {
     
    //       console.log('컴포넌트가 화면에서 사라짐');
    //     };
    //   }, []);
      
    const { t,i18n } = useTranslation();
    //console.log(i18n)
    // </script>
 
    var messages = [
        new Message({ id: 1, message: t("chat.start") ,senderName:'Admin'}), // Blue bubble
    ]



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
        firebaseApp= firebase.initializeApp(firebaseConfig);
    }

    const delayTime=()=>{
        setTimeout(() => {
            setClickable(true)
        }, 1000);

    }

  
    function writeUserData(text) {
      
        if(text!=="" && clickable){
            setClickable(false)
        //console.log(firebase.database())
        var newPostKey = firebase.database().ref().child('/users/').push().key;
        var userinfo = {
            normal_chat:{
            server_code:sessionStorage.server_code,
            user_name:sessionStorage.user_name,
            user_nickname:sessionStorage.chatNickname
            },
            admin_chat:{

            }
        }

        var messages = {
            normal_chat:{
                server_code:sessionStorage.server_code,
                user_name:sessionStorage.user_name.replace(/\"/g, ''),
                text:text,
                chatId:sessionStorage.chatId,
                user_nickname:sessionStorage.chatNickname,
                timestamp2:new Date().getTime(),
            }
        }
        setMessage("");
        return firebase.database().ref('/test/').push(messages);
    }
    }
    const onClickSubmit = () =>{}
    const onKeyPressHandler = (e)=>{
      
        if (e.key === 'Enter') {
        e.preventDefault();
        writeUserData(message);
          //console.log("dasdlkjnljknkj")
        }

    }



// var foo2 = commentsRef.orderByChild("normal_chat/timestamp2").startAt(time.getTime())
// foo2.on('child_changed', function(data) {
//     //console.log(data.val().normal_chat.text,"sadasd")
//     var newMessage = [...messages]
//     if(data.val().normal_chat.user_name.replace(/\"/g, '') === sessionStorage.user_name.replace(/\"/g, '')){
//         messages.push({id:0, message:data.val().normal_chat.text})
//     }else{
//         messages.push({id:1, message:data.val().normal_chat.text})
//     }
//     //setChatlogs(newMessage)
    
    
//   //addCommentElement(postElement, data.key, data.val().text, data.val().author);
// });
const messagesEndRef = useRef(null)
const scrollToBottom = (e) => { 
    if (messagesEndRef.current) {
        messagesEndRef.current.addEventListener('touchmove', (messagesEndRef) => {
          if (!messagesEndRef.currentTarget) {
            return;
          }
          if (messagesEndRef.currentTarget.scrollTop === 0) {
            messagesEndRef.currentTarget.scrollTop = 1;
          } else if (messagesEndRef.currentTarget.scrollHeight === messagesEndRef.currentTarget.scrollTop +
            messagesEndRef.currentTarget.offsetHeight) {
                messagesEndRef.currentTarget.scrollTop -= 1;
          }
        });
      }
    // if (messagesEndRef.current) { 
    //     messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }) } 
}
// const scrollToBottom = () => {
    

//   messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
// }

const forceupdate = useForceUpdate();
useEffect(()=>{scrollToBottom()
    //setChatlogs(messages)

}

, [messages]);
useEffect(()=>{delayTime()}, [clickable]);
useEffect(()=>{
    setChatlogs(messages)
//     var ref = firebase.database().ref('test/');
// var now = Date.now();
// var cutoff = now - 2 * 60 * 60 * 1000;
// var old = ref.orderByChild('normal_chat/timestamp2').endAt(cutoff).limitToLast(1);
// old.on('child_added', function(snapshot) {
//     //console.log(snapshot.val())
//     snapshot.ref.remove()
//     //snapshot.commentsRef.remove();
// });
    var commentsRef = firebase.database().ref('test/');
    //console.log(localStorage.timestamp)
    const time =  new Date(parseInt(localStorage.timestamp,10))
    //console.log(time.getTime())
    var foo = commentsRef.orderByChild("normal_chat/timestamp2").limitToLast(10)
    foo.on('child_added', function(data) {
    var newMessage = [...messages]
    //console.log(data.val().normal_chat)
    setChatlogs(messages)
    if(data.val().normal_chat.user_name.replace(/\"/g, '') === sessionStorage.user_name.replace(/\"/g, '')){
        newMessage.push({id:0, message:data.val().normal_chat.text})
    
    }else{
        newMessage.push({id:data.val().normal_chat.chatId, message:data.val().normal_chat.text,senderName:data.val().normal_chat.user_nickname.replace(/\"/g, '')})
    }
    setChatlogs(newMessage)
    messages = newMessage
    //data.commentsRef.remove();
    //setChatlogs(newMessage)
  //addCommentElement(postElement, data.key, data.val().text, data.val().author);
});
    // setInterval(() => {
    //     //forceupdate()
    //    // setChatlogs(messages)
    //    // console.log(chatlogs.length)
    // }, 1000);

//     var commentsRef = firebase.database().ref('test');
//     //console.log(localStorage.timestamp
//     const time =  new Date(parseInt(localStorage.timestamp,10))
//     //console.log(time.getTime())
//     var foo = commentsRef.orderByChild("normal_chat/timestamp2").startAt(time.getTime())
//     const listener = foo.on('child_added', function(data) {
//     console.log(data.val().normal_chat.text,"sadasd")
//     if(data.val().normal_chat.user_name.replace(/\"/g, '') === sessionStorage.user_name.replace(/\"/g, '')){
//         messages.push({id:0, message:data.val().normal_chat.text})

//     }else{
//         messages.push({id:1, message:data.val().normal_chat.text})
//     }
// })

//     return ()=> commentsRef.off('child_added',listener)

}, [toggle]);

    return (
        <Fragment>
            <div id="body">
                <div id="chat-circle" className="btn btn-raised" onClick={() => chatCirCleonclick()}>
                    <div id="chat-overlay"></div>
                    <i class="fa fa-commenting-o fa-3x" aria-hidden="true" style={{ textAlign: "center", marginLeft: "6.5px", marginTop: "4px", zIndex: "10" }}></i>
                </div>
                    {toggle===true&&<div className="chat-box" style={{ display: toggle ? 'block' : 'none', zIndex: "10", }}>
                        <div class="chat-box-header">
                            ChatBox
      <span class="chat-box-toggle" style={{ display: toggle ? 'block' : 'none' }} onClick={() => chatCirCleonclick()}><CloseIcon></CloseIcon></span>
                        </div>
                        <div className="chat-box-body">
                            <div className="chat-box-overlay">
                            </div>
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
                                <div ref={messagesEndRef}></div>
                            </div>
                            </ScrollToBottom>
                        </div>
                        <div class="chat-input">
                            <form>
                                <input type="text" value={message} onKeyPress={(e) => onKeyPressHandler(e)} onSubmit={()=>writeUserData(message)} onChange={({ target: { value } }) => setMessage(value)} autoComplete='off' id="chat-input" placeholder="Send a message..." />
                                <div className="chat-submit" id="chat-submit" onSubmit={()=>writeUserData(message)} onClick={()=>writeUserData(message)} ><SendIcon></SendIcon></div>
                            </form>
                        </div>
                    </div>
}
            </div>

        </Fragment>


    );
}
export default withTranslation()(Chat);