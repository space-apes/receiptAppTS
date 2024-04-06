interface SessionService{
    create(params: {userId?: number, roomName: string, displayedName: string}): string; //returns jwt  
    isValidSessionToken(params: {jwt: string}): Promise<Jwt>; 
    //updateSessionToken(params: {jwt: string, username?: string, password?: string}): string; //returns jwt 
    addRandomStringToRoomName(roomName: string): string;
    convertJWTDurationToSeconds(duration:string): number;
}

export default SessionService; 

