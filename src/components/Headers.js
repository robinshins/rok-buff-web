import React, { Component } from 'react';
import './Headers.css';
import ReactFlagsSelect from 'react-flags-select';
//import css module
import 'react-flags-select/css/react-flags-select.css';
import {withTranslation,useTranslation} from "react-i18next";
import i18n from "i18next";
import {connect} from 'react-redux'
import {sub,add,lang} from '../actions'
import { render } from '@testing-library/react';




class Header extends Component {

state = {language:""}

componentWillMount(){
    i18n.changeLanguage('ko');
    const language = localStorage.language
    //i18n.changeLanguage("ko");
    if(language===JSON.stringify("ko")){
        console.log(language)
        i18n.changeLanguage("ko");
    }else{
        i18n.changeLanguage("en");
    }
}



 MenuItem = ({ active, children, to }) => (
    <div className="menu-item">
        {children}
    </div>
)

 onSelectFlag = (countryCode)=>{
    console.log(countryCode)
    if(countryCode==='KR'){
        i18n.changeLanguage('ko');
        localStorage.language = JSON.stringify('ko')
    }else{
        i18n.changeLanguage('en');
        localStorage.language = JSON.stringify('en')
    }
    this.setState({
        language:countryCode
    })
 
    // this.props.changelang()
    //this.props.store.dispatch(lang(countryCode));

    
}



render(){
    const { t } = this.props;
    const {onSelectFlag} = this
    return (
        <div>
            <div className="logo">
                <title2> ROK BUFF</title2>
            </div>
            <ReactFlagsSelect
                    className="menu-flags" 
                    countries={["US", "KR"]}
                    onSelect ={onSelectFlag}
                    alignOptions="right"
                    selectedSize={15}
                    optionsSize={10}
                />

            {/* <div className="menu">
                <MenuItem>홈</MenuItem>
                <MenuItem>소개</MenuItem>
                <MenuItem>QnA</MenuItem>
            </div> */}
        </div>
    );
}
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

export default  withTranslation()(Header);;
