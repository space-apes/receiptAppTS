interface JWTClaims{
    userId: number, 
    roomName: string,
    displayedName: string
    //exp: string expiration should be added when signing
}

export default JWTClaims;