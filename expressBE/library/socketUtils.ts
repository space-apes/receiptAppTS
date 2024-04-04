import crypto from 'crypto';

const getRandomString = ():string => {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}

export{getRandomString}; 