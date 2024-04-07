interface JWTClaims{
    userId: number, 
    roomName: string,
    displayedName: string
    isInitiator: boolean
}

export default JWTClaims;