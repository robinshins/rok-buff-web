import React, { Fragment, useState, useEffect } from 'react';
import './Chat.css'
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { ChatFeed, Message } from 'react-chat-ui'


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
    const chatCirCleonclick = () => {
        console.log(toggle)
        setToggle(!toggle);

    }
    //     <script>
    //     $(function() {
    // $("#chat-circle").click(function() {    
    //   $("#chat-circle").toggle('scale');
    //   $(".chat-box").toggle('scale');
    // })

    // $(".chat-box-toggle").click(function() {
    //   $("#chat-circle").toggle('scale');
    //   $(".chat-box").toggle('scale');
    // })
    // })

    // </script>
    const messages = [
        new Message({
            id: 0,
            message: "채팅서비스가 곧 시작됩니다!",
        }), // Gray bubble
        new Message({ id: 1, message: " 버프를 기다리는 동안 채팅을 즐겨보세요!" }), // Blue bubble
    ]


    return (



        <Fragment>

            <div id="body">
                <div id="chat-circle" class="btn btn-raised" onClick={() => chatCirCleonclick()}>
                    <div id="chat-overlay"></div>
                    <i class="fa fa-commenting-o fa-3x" aria-hidden="true" style={{ textAlign: "center", marginLeft: "6.5px", marginTop: "4px" }}></i>
                </div>

 
                    {toggle===true&&<div class="chat-box" style={{ display: toggle ? 'block' : 'none', zIndex: "10", }}>
                        <div class="chat-box-header">
                            ChatBot
      <span class="chat-box-toggle" style={{ display: toggle ? 'block' : 'none' }} onClick={() => chatCirCleonclick()}><CloseIcon></CloseIcon></span>
                        </div>
                        <div class="chat-box-body">
                            <div class="chat-box-overlay">
                            </div>
                            <div class="chat-logs">
                                <ChatFeed
                                    messages={messages} // Boolean: list of message objects
                                    isTyping={false} // Boolean: is the recipient typing
                                    hasInputField={false} // Boolean: use our input, or use your own
                                    showSenderName // show the name of the user who sent the message
                                    bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
                                    // JSON: Custom bubble styles
                                    bubbleStyles={
                                        {
                                            text: {
                                                fontSize: 10
                                            },
                                            chatbubble: {
                                                borderRadius: 70,
                                                padding: 10
                                            }
                                        }
                                    }
                                />
                            </div>
                        </div>
                        <div class="chat-input">
                            <form>
                                <input type="text" autoComplete='off' id="chat-input" placeholder="Send a message..." />
                                <button type="submit" class="chat-submit" id="chat-submit"><SendIcon></SendIcon></button>
                            </form>
                        </div>
                    </div>
}
               
            </div>
        </Fragment>


    );
}


export default Chat;