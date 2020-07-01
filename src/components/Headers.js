import React, { Component, useState, useEffect, Fragment } from 'react';
import Headercss from './Headers.css';
import axios from '../api';
import ReactFlagsSelect from 'react-flags-select';
//import css module
import 'react-flags-select/css/react-flags-select.css';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";
import { Link, withRouter,useLocation } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { sub, add, lang } from '../actions'
import { render } from '@testing-library/react';
import Chat from './Chat'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'




const Header = () => {
    const [language, setLanguage] = useState(localStorage.language);
    const [notice_title, setNoticeTitle] = useState("");
    const [notice_article, setNoticeArticle] = useState("");
    const [apply_success, SetApplySuccess] = useState(sessionStorage.apply_success);
    const [title_type, setTitleType] = useState(sessionStorage.title_type);
    const [waiting_order, setWaitingOrder] = useState(-1);
    const [waitItems, setWaitingItems] = useState([]);
    const [name, setName] = useState(sessionStorage.user_name);
    const [myrank, setMyRank] = useState(-1);

    // state = { language: "", notice_title: "", notice_article: "", apply_success: sessionStorage.apply_success, 
    // title_type: "", waiting_order: -1,waitItems:[],
    // name:'', myrank:0 }
    const { t, i18n } = useTranslation();
    // componentWillMount() {
    //     this.getNotice();
    //     this.setWaitingPopup();
    //     i18n.changeLanguage('ko');
    //     const language = localStorage.language
    //     //i18n.changeLanguage("ko");
    //     if (language === JSON.stringify("ko")) {
    //         console.log(language)
    //         i18n.changeLanguage("ko");
    //     } else {
    //         i18n.changeLanguage("en");
    //     }
    // }

    useEffect(() => {
        //getWaitingList();
        getNotice();
        //setWaitingPopup();
        setTimeout(() => {
            getWaitingList();
            setWaitingPopup();
        }, 5000);
        i18n.changeLanguage('ko');
        if (language === JSON.stringify("ko")) {
            console.log(language)
            i18n.changeLanguage("ko");
        } else {
            i18n.changeLanguage("en");
        }
        return () => {
            console.log('컴포넌트가 화면에서 사라짐');
        };
    }, []);



    const getNotice = async (t) => {
        try {
            const response = await axios.get('userresponse/', {
                params: {
                    'mode': "ServerBoard_list"
                }
            }
            );
            console.log(response.data.info[response.data.info.length - 1])
            if (response.status === 201) {
                setNoticeTitle( response.data.info[response.data.info.length - 1].title)
                setNoticeArticle(response.data.info[response.data.info.length - 1].article)
                // this.setState({
                //     notice_title: response.data.info[response.data.info.length - 1].title,
                //     notice_article: response.data.info[response.data.info.length - 1].article
                // })
                //alert(this.props.t("notice.DeleteSuccess"))
                //window.location.reload()
            } else {
            }
        } catch (error) {
            //alert(this.props.t("notice.DeleteFail"))
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.value !== this.props.value) {
    //       doSomething();  
    //     }
    //   }



    const MenuItem = ({ active, children, to }) => (
        <Link to={to} className="menu-item">
            {children}
        </Link>
    )

    // MenuItem = ({ active, children, to }) => (
    //     <Link to={to} className="menu-item">
    //         {children}
    //     </Link>
    // )

    const onSelectFlag = (countryCode) => {
        //console.log(countryCode)
        if (countryCode === 'KR') {
            i18n.changeLanguage('ko');
            localStorage.language = JSON.stringify('ko')
        } else {
            i18n.changeLanguage('en');
            localStorage.language = JSON.stringify('en')
        }
        setLanguage(countryCode)
        // this.setState({
        //     language: countryCode
        // })

        // this.props.changelang()
        //this.props.store.dispatch(lang(countryCode));


    }

    useEffect(() => {
    setWaitingPopup();
    getWaitingList();
      }, [myrank]);


    const onclickLogout = () => {
        sessionStorage.islogin = JSON.stringify("-1")
        sessionStorage.is_login = JSON.stringify("false")
        sessionStorage.apply_success = JSON.stringify('-1');
        window.location.href = `/`
    }

    const setWaitingPopup = () => {
        console.log(sessionStorage.title_type === JSON.stringify(3))
        if (sessionStorage.title_type === JSON.stringify(1)) {
            setTitleType(1)
            //this.setState({ title_type: 1 })
        } else if (sessionStorage.title_type === JSON.stringify(2)) {
            setTitleType(2)
            //this.setState({ title_type: 2 })
        } else if (sessionStorage.title_type === JSON.stringify(3)) {
            setTitleType(3)
            //this.setState({ title_type: 3 })
        }
    }

    const getWaitingList = async text => {
        try {
            //console.log(this.props)

            const response = await axios.get('qresponse/', {
                params: {
                    'mode': "get_MYQ", 'dat_time': "1900-01-01 00:00:00.00+00:00", 'title_type': title_type
                }
            }
            );
            console.log(response)
            if (response.status === 200) {
                const singleItem = response.data.info[response.data.info.length - 1]
                console.log(response)
                const item = []
                for (var i = 0; i < response.data.info.length; i++) {
                    item.push({ name: response.data.info[i][2], server: response.data.info[i][1] })
                }
                setWaitingItems(item)
                //this.setState({ waitItems: item })
                item.map((item, index) => {
                    console.log(item.name)
                    console.log(name)
                    console.log(sessionStorage.user_name)
                    //console.log(this.state.name)
                    if (item.name === name.replace(/\"/g, '')) {
                        console.log("asdasdasda",index)
                        setMyRank(index + 1) }
                });

                if(response.data.info.length===0){
                    setMyRank(0)
                }

                console.log(waitItems)
                console.log(myrank)
            } else if (response.status) {
                console.log(response)

            }

        } catch (error) {
            console.log(error.response)
            console.log(error)
            //this.setState({ flag: 2 })
        }
    }

    //const { t } = this.props
    //console.log(this.state.apply_success)
    //   if(sessionStorage.apply_success === JSON.stringify('1') && this.continue){
    //       this.continue=false;
    //       this.getWaitingList();
    //   }

console.log(title_type)

    const popover = (
        <Popover style={{ backgroundColor: "#6c757d", borderRadius: "10%", opacity: "95%" }} >
            <Popover.Title as="h4" height="100px">
                <p style={{ color: "#ffffff", marginLeft: "10px" }}>{t("waiting_order")}</p>
            </Popover.Title>
            <Popover.Content>
                &nbsp;<strong>{title_type === 1 && t("buff.duke")}
                {title_type === 2 && t("buff.scientist")}
                    {title_type === 3 && t("buff.architecture")}
                </strong>&nbsp;<strong style={{ color: "#FD6558" }}>{myrank}{t('th')}</strong> {t('order')}. &nbsp;
                   <br />
                <br />
            </Popover.Content>
        </Popover>
    );
    // 
    const popup = () => {
        return popover
    }
    const Example = () => (
        <OverlayTrigger placement="right" trigger="click" width="50px" height="50px" overlay={popover} >
            <Image src="https://ifh.cc/g/G2axDk.png" width="30px" height="30px" >
            </Image>
        </OverlayTrigger>
    );
    const location = useLocation();


    // setTimeout(()=>{
    //     return (

    //         <Fragment>
    //             {location.pathname !== "/" && location.pathname !== "/register/" && location.pathname !== "/register"
    //                 && sessionStorage.is_login === JSON.stringify('true') &&
    //                 <Chat />}
    
    //             <div>
    //                 <div className="logo" >
    //                     {sessionStorage.apply_success === JSON.stringify('1') &&
    //                         <div style={{ float: "left", marginLeft: "5px" }} >
    //                             <Example></Example>
    //                         </div>
    //                     }
    //                     <headertitle> ROK MANAGER</headertitle>
    //                     {location.pathname !== "/" && location.pathname !== "/register/" && location.pathname !== "/register"
    //                         && sessionStorage.is_login === JSON.stringify('true') && <headerlogout type="button" onClick={() => onclickLogout()}> Logout</headerlogout>}
    //                 </div>
    
    //                 {location.pathname !== "/" && location.pathname !== "/register/" && location.pathname !== "/register"
    //                     && sessionStorage.is_login === JSON.stringify('true') && sessionStorage.is_admin !== JSON.stringify('1') &&
    //                     <div className="menu">
    //                         <MenuItem to={'/buffmain/'}>{t("header.title")}</MenuItem>
    //                         <MenuItem to={'/ruinregister/'}>{t("header.ruin")}</MenuItem>
    //                         <MenuItem to={'/personalsetting/'}>{t("header.info")}</MenuItem>
    //                     </div>}
    
    //                 {location.pathname !== "/" && location.pathname !== "/register/" && location.pathname !== "/register"
    //                     && sessionStorage.is_login === JSON.stringify('true') && sessionStorage.is_admin === JSON.stringify('1') &&
    //                     <div className="menu">
    //                         <MenuItem to={'/setbuff/'}>{t("header.titlesetting")}</MenuItem>
    //                         <MenuItem to={'/alliancesetting/'}>{t("header.alli")}</MenuItem>
    //                         <MenuItem to={'/usermanagement/'}>{t("header.membermanage")}</MenuItem>
    //                     </div>}
    //                 <ReactFlagsSelect
    //                     className="menu-flags"
    //                     countries={["US", "KR"]}
    //                     onSelect={onSelectFlag}
    //                     alignOptions="right"
    //                     selectedSize={15}
    //                     optionsSize={10}
    //                 />
    //                 <ins class="kakao_ad_area"
    //                     data-ad-unit="DAN-1h84s2np9jckm"
    //                     data-ad-width="320"
    //                     data-ad-height="50"></ins>
    //                 <script type="text/javascript" src="//t1.daumcdn.net/kas/static/ba.min.js" async></script>
    //                 {location.pathname === "/setbuff/" && <div className="update_notice">
    //                     운영자 공지({notice_title}) :
    //                     <content> {notice_article}</content>
    //                 </div>
    //                 }
    //                 {location.pathname === "/setbuff" && <div className="update_notice">
    //                     운영자 공지({notice_title}) :
    //                     <content> {notice_article}</content>
    //                 </div>
    
    //                 }
    //             </div>
    //         </Fragment>
    
    //     );
    // },5000)
  
    return (
        
        <Fragment>
            {location.pathname !== "/" && location.pathname !== "/register/" && location.pathname !== "/register"
                && sessionStorage.is_login === JSON.stringify('true') &&
                <Chat />}
            <div>
                <div className="logo" >
                    {sessionStorage.apply_success === JSON.stringify('1') &&
                        <div style={{ float: "left", marginLeft: "5px" }} >
                            <Example></Example>
                        </div>
                    }
                    <headertitle> ROK MANAGER</headertitle>
                    {location.pathname !== "/" && location.pathname !== "/register/" && location.pathname !== "/register"
                        && sessionStorage.is_login === JSON.stringify('true') && <headerlogout type="button" onClick={() => onclickLogout()}> Logout</headerlogout>}
                </div>

                {location.pathname !== "/" && location.pathname !== "/register/" && location.pathname !== "/register"
                    && sessionStorage.is_login === JSON.stringify('true') && sessionStorage.is_admin !== JSON.stringify('1') &&
                    <div className="menu">
                        <MenuItem to={'/buffmain/'}>{t("header.title")}</MenuItem>
                        <MenuItem to={'/ruinregister/'}>{t("header.ruin")}</MenuItem>
                        <MenuItem to={'/personalsetting/'}>{t("header.info")}</MenuItem>
                    </div>}

                {location.pathname !== "/" && location.pathname !== "/register/" && location.pathname !== "/register"
                    && sessionStorage.is_login === JSON.stringify('true') && sessionStorage.is_admin === JSON.stringify('1') &&
                    <div className="menu">
                        <MenuItem to={'/setbuff/'}>{t("header.titlesetting")}</MenuItem>
                        <MenuItem to={'/alliancesetting/'}>{t("header.alli")}</MenuItem>
                        <MenuItem to={'/usermanagement/'}>{t("header.membermanage")}</MenuItem>
                    </div>}
                <ReactFlagsSelect
                    className="menu-flags"
                    countries={["US", "KR"]}
                    onSelect={onSelectFlag}
                    alignOptions="right"
                    selectedSize={15}
                    optionsSize={10}
                />
                <ins class="kakao_ad_area"
                    data-ad-unit="DAN-1h84s2np9jckm"
                    data-ad-width="320"
                    data-ad-height="50"></ins>
                <script type="text/javascript" src="//t1.daumcdn.net/kas/static/ba.min.js" async></script>
                {location.pathname === "/setbuff/" && <div className="update_notice">
                    운영자 공지({notice_title}) :
                    <content> {notice_article}</content>
                </div>
                }
                {location.pathname === "/setbuff" && <div className="update_notice">
                    운영자 공지({notice_title}) :
                    <content> {notice_article}</content>
                </div>

                }
            </div>
        </Fragment>

    );
            
   
}




// const mapDispatchToProps = (dispatch, /*ownProps*/) => {
//     return {
//         changelang: (e) => dispatch(lang(e))
//     };
// };

// const mapStateToProps = (state, /*ownProps*/) => {
//     //console.log(state)
//     return {
//         lang: state.data.lang,
//     };
// };


// Header = connect(mapStateToProps, mapDispatchToProps)(Header);
//Header = connect(null, mapDispatchToProps)(Header);
const AdaptiveHeader = withRouter(Header)
export default withTranslation()(AdaptiveHeader);;
