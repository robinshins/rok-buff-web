// actions/index.js
export const ADD = 'ADD';
export const SUB = 'SUB';
export const LANG = 'LANG';
export const SERVER_CODE = "SERVER_CODE";


export const server_code = (e) =>{
    return{
        type: SERVER_CODE,
        server_code:e
    }
}

export const add = () => {
    return {
        type: ADD
    }
};

export const sub = () => {
    return {
        type: SUB
    }
};

export const lang = (e) => {
    return {
        type: LANG,e
    }
};

