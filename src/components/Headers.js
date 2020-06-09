import React, { Component,useState, useEffect  } from 'react';
import './Headers.css';
import ReactFlagsSelect from 'react-flags-select';
//import css module
import 'react-flags-select/css/react-flags-select.css';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { sub, add, lang } from '../actions'
import { render } from '@testing-library/react';




class Header extends Component {

    state = { language: "" }

    componentWillMount() {
        i18n.changeLanguage('ko');
        const language = localStorage.language
        //i18n.changeLanguage("ko");
        if (language === JSON.stringify("ko")) {
            console.log(language)
            i18n.changeLanguage("ko");
        } else {
            i18n.changeLanguage("en");
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.value !== this.props.value) {
    //       doSomething();  
    //     }
    //   }



    MenuItem = ({ active, children, to }) => (
        <Link to={to} className="menu-item">
            {children}
        </Link>
    )

    onSelectFlag = (countryCode) => {
        console.log(countryCode)
        if (countryCode === 'KR') {
            i18n.changeLanguage('ko');
            localStorage.language = JSON.stringify('ko')
        } else {
            i18n.changeLanguage('en');
            localStorage.language = JSON.stringify('en')
        }
        this.setState({
            language: countryCode
        })

        // this.props.changelang()
        //this.props.store.dispatch(lang(countryCode));


    }
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      }



    render() {
        const { match, location, history } = this.props
        
        const { t } = this.props;
        const { onSelectFlag, MenuItem } = this
        console.log(localStorage.is_login)
        return (
            <div>
                <div className="logo">
                    <title2> ROK BUFF</title2>
                </div>
              
                {location.pathname!=="/"&& sessionStorage.is_admin!==JSON.stringify('1')&&<div className="menu">
                    <MenuItem to={'/buffmain/'}>TITLE</MenuItem>
                    <MenuItem to={'/ruinregister/'}>RUIN/ALTAR REGISTER</MenuItem>
                    <MenuItem to={'/personalsetting/'}>PERSONAL INFO</MenuItem>
                </div>}

                {location.pathname!=="/"&& sessionStorage.is_admin===JSON.stringify('1')&&<div className="menu">
                    <MenuItem to={'/setbuff/'}>TITLE Setting</MenuItem>
                    <MenuItem to={'/alliancesetting/'}>Alliance Setting</MenuItem>
                    <MenuItem to={'/usermanagement/'}>User Management</MenuItem>
                </div>}

                <ReactFlagsSelect
                    className="menu-flags"
                    countries={["US", "KR"]}
                    onSelect={onSelectFlag}
                    alignOptions="right"
                    selectedSize={15}
                    optionsSize={10}
                />


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
const AdaptiveHeader = withRouter(Header)
export default withTranslation()(AdaptiveHeader);;
