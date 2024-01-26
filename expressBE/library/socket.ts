import crypto from 'crypto';

const getRandomRoomName = ():string => {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}

export{getRandomRoomName}; 