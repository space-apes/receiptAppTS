interface SessionService{
    create(params: {userId: number, roomName: string, displayedName: string, isInitiator: boolean}): string; //returns jwt  
    isValidSessionToken(params: {jwt: string}): Promise<boolean>; 
    //updateSessionToken(params: {jwt: string, username?: string, password?: string}): string; //returns jwt 
    addRandomStringToRoomName(roomName: string): string;
    convertJWTDurationToSeconds(duration:string): number;
}

export default SessionService; 

