import React, { Fragment, Component, useState } from 'react';
import axios from '../api';
import Http from '../api';
import './BuffResult.css';
import { withTranslation, useTranslation } from "react-i18next";
import qs from 'qs';
import Popover from 'react-bootstrap/Popover'
import popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'

class Error extends Component {


    render(){
        const { t } = this.props;
        return(
            <Fragment>
            <div style={{margin:"0 auto" ,textAlign:'center'}}>
            <img src="https://ifh.cc/g/nKgNZi.jpg"/>
            <div style={{fontSize:'3.5rem', fontWeight:'bold',verticalAlign:'middle',marginTop:'15rem'}}>{t('errorpage.title')} </div>
            <div style={{fontSize:'1.5rem', color:'#969696'}}> {t('errorpage.body')} </div>
            </div>
            </Fragment>
        )
    }
}

export default withTranslation()(Error);