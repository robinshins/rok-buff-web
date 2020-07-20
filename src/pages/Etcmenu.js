import React, { Fragment, Component, useState } from 'react';
import Http from '../api';
import './Roktest.css';
import qs from 'qs';
import { withTranslation, useTranslation } from "react-i18next";
import i18n from "i18next";


 const Etcmenu=()=> {
    const { t, i18n } = useTranslation();

    return (
        <main className="Home">
          <div className="ruintitle">
            {t("header.sidemenu")}
          </div>
          <section className="form-wrapper">
          <div className="create-button"onClick={event => window.location.href = '/roktest/'}>
            {t("rok.test")}
          </div>
          <div className="create-button" onClick={event => window.location.href = '/personalsetting/'}>
          {t("header.info")}
          </div>
          </section>
        </main>
  
      );

}
export default withTranslation()(Etcmenu);