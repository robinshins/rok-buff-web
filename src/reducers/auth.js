import React, { Fragment, Component } from 'react';
import axios from '../api';
import qs from 'qs';


const admin = 2;
const auth = 1;
const fail = -1;

export async function signIn({ email, password }) {
      
        try {
          const response = await axios.patch('loginresponse/', qs.stringify({
            'mode': "login", 'password':password , 'account': email
          })
          );
          if (response.status === 200) {
            if (response.data.info.account.is_serveradmin === 1) {
                return admin
            }else{
             return auth;
            }

          } else {
              return fail;
          }
    
        } catch (error) {
            return fail;
    
        }
      
  }