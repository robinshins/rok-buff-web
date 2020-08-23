import React, { Fragment, Component, useState,useEffect } from 'react';
import axios from '../api';
import './Roktest.css';
import qs from 'qs';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";


 const Etcset=()=> {
    const { t, i18n } = useTranslation();
    const [downloadUrl, setDownloadUrl] = useState();

    
  const getExcelLink = async text => {
    try {
      const response = await axios.get('statres/');
      //console.log(response)
      if (response.status === 200) {
          setDownloadUrl(response.data.info)
      } 
    
    } catch (error) {
        console.log(error)

      //TODO
      // window.location.href = '/'
    }

  }

  useEffect(() => {
      getExcelLink();
    return () => {
      console.log('컴포넌트가 화면에서 사라짐');
    };
  }, []);

    return (
        <main className="Home">
          <div className="ruintitle">
            {t("etcset")}
          </div>
          <section className="form-wrapper">
          <div className="create-button"onClick={event => window.location.href = '/alliancesetting/'}>
            {t("header.alli")}
          </div>
          <div className="create-button" onClick={event =>  window.open(downloadUrl,"_blank")}>
          {t("screenshotinvest download")}
          </div>
          </section>
        </main>
  
      );

}
export default withTranslation()(Etcset);