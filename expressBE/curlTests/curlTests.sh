#!/usr/bin/bash


#if you use --include option, output is both headers and body of response
#you can prettify response body by removing --include and piping curl
# into 'jq' command

# BEWARE OF TRAILING COMMAS IN FINAL ELEMENTS OF PAYLOADS! haha...
# also if you include headers in curl flags, jq won't be able to parse

########## VARIABLES #########
URL="http://127.0.0.1:4000/api"

########## FUNCTIONS ########## 


# make sure to check out the jwt with a jwt decoding tool and compare to the endpoint code
# to see that fields are correct. a successful login should yield a non '-1' userId value
POST_login_success1() {

    payload='{
        "email": "testUser1@test.com",
        "password": "testuser1password"
    }';

    curl \
     --include \
     --cookie-jar 'cookies.txt' \
     --request 'POST' \
     --header 'Content-Type: application/json' \
     --data "$payload" \
     "$URL/users/login"
}

POST_users_success1() {
    payload='{
        "firstName": "testCreateUser",
        "lastName": "testCreateUser",
        "email": "testCreateUser@test.com",
        "password": "testcreatUserpassword"
    }';

    curl \
     --include \
     --cookie-jar 'cookies.txt' \
     --request 'POST' \
     --header 'Content-Type: application/json' \
     --data "$payload" \
     "$URL/users"
}

GET_users_success1(){
    curl \
	 --include \
     --request 'GET' \
     "$URL/users/1"

}

GET_users_failure_notFound1(){
    curl \
	 --include \
     --request 'GET' \
     "$URL/users/12321321313123213"

}

PUT_users_success1(){

    payload='{
        "email": "testUser1Updated@test.com"
    }'

    curl \
     --include \
     --cookie-jar 'cookies.txt' \
     --request 'PUT' \
     --header 'Content-Type: application/json' \
     --data "$payload" \
     "$URL/users/1"
}

PUT_users_success2(){

    payload='{
        "email": "testUser1UpdatedSecond@test.com",
		"firstName": "testUser1UpdatedSecondFirstName"
    }'

    curl \
     --include \
     --cookie-jar 'cookies.txt' \
     --request 'PUT' \
     --header 'Content-Type: application/json' \
     --data "$payload" \
     "$URL/users/1"
}

PUT_users_failure_noUpdatedFields1(){

    curl \
     --include \
     --cookie-jar 'cookies.txt' \
     --request 'PUT' \
     --header 'Content-Type: application/json' \
     "$URL/users/1"
}

PUT_users_failure_invalidFields1(){

    payload='{
        "chickens": "testUser1UpdatedSecond@test.com"
    }';

    curl \
     --include \
     --cookie-jar 'cookies.txt' \
     --request 'PUT' \
     --header 'Content-Type: application/json' \
     --data "$payload" \
     "$URL/users/1"
}
PUT_users_failure_invalidFields1(){

    payload='{
        "chickens": "testUser1UpdatedSecond@test.com"
    }';

    curl \
     --include \
     --cookie-jar 'cookies.txt' \
     --request 'PUT' \
     --header 'Content-Type: application/json' \
     --data "$payload" \
     "$URL/users/1"
}

PUT_users_failure_noUserExists1(){

    payload='{
        "email": "testUserPutNoSuchUser@test.com",
		"firstName": "testUser1UpdatedSecondFirstName"
    }'

    curl \
     --include \
     --cookie-jar 'cookies.txt' \
     --request 'PUT' \
     --header 'Content-Type: application/json' \
     --data "$payload" \
     "$URL/users/123214154142"
}


DELETE_users_success1(){

    curl \
     --include \
     --cookie-jar 'cookies.txt' \
     --request 'DELETE' \
     --header 'Content-Type: application/json' \
     "$URL/users/1"
}


POST_transactions_success1() {
    payload='{
        "initiatorUserId": 8,
        "businessName": "testBusiness",
        "users": [
            {
                "firstName": "testUser",
                "lastName": "testUser",
                "userId": -1
            } 
        ],
        "receiptItems": [
            {
                "itemName": "testItem",
                "itemPrice": 0.00,
                "username": "testuserS",
                "userId": -1
            } 
        ]
    }'

    curl \
     --include \
     --cookie-jar 'cookies.txt' \
     --request 'POST' \
     --header 'Content-Type: application/json' \
     --data "$payload" \
     "$URL/transactions"
}

GET_transactions_success1() {

    curl \
     --include \
     --cookie-jar 'cookies.txt' \
     --request 'GET' \
     --header 'Content-Type: application/json' \
     "$URL/transactions/1"
}

GET_transactions_users_success1() {

    curl \
     --cookie-jar 'cookies.txt' \
     --request 'GET' \
     --header 'Content-Type: application/json' \
     "$URL/transactions/user/3" | jq
}

POST_session_guest1() {
    payload='{
        "displayedName": "tiny tim",
        "roomName": "tims cool room" 
    }'

    curl \
     --cookie-jar 'cookies.txt' \
     --request 'POST' \
     --header 'Content-Type: application/json' \
     --data "$payload" \
     "$URL/sessions/createGuestSession"
}

POST_session_failure_roomNameContainsHyphen_guest1() {
    payload='{
        "displayedName": "tiny tim",
        "roomName": "tims cool-room" 
    }'

    curl \
     --cookie-jar 'cookies.txt' \
     --include \
     --request 'POST' \
     --header 'Content-Type: application/json' \
     --data "$payload" \
     "$URL/sessions/createGuestSession"
}

POST_session_failure_nonexistent_email_registered1() {
    payload='{
        "displayedName": "tiny tim",
        "roomName": "tims coolroom",
        "email": "nosuchemail@test.com",
        "password": "coolpasswordbro:"
    }'

    curl \
     --cookie-jar 'cookies.txt' \
     --include \
     --request 'POST' \
     --header 'Content-Type: application/json' \
     --data "$payload" \
     "$URL/sessions/createRegisteredSession"
}


########## EXECUTION ##########

#this checks to see if the first CLI argument matches 
#the name of a defined function above. if it does, it executes that function.

if [[ $# == 1 ]]; then
    if [[ $(type -t $1) == function ]]; then
        $1
    else 
        echo "there is no test function by that name"
    fi 
else
    echo "this script accepts 1 argument: the name of the function to execute"
fi

