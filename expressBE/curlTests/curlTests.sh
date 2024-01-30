#!/usr/bin/bash


#if you use --include option, output is both headers and body of response
#you can prettify response body by removing --include and piping curl
# into 'jq' command

########## VARIABLES #########
URL="http://127.0.0.1:4000/api"

########## FUNCTIONS ########## 

#POST_users_success_1() {
#    email="testUser20@test.com"
#    password="testUser20Password"
#
#    curl -X POST \ 
#        "$URL/users" \
#        --header 'Content-Type: application/json' \
#        --data '
#        {
#            "email": "$email",
#            "password": "$password"
#        }' | jq
#}
#


# make sure to check out the jwt with a jwt decoding tool and compare to the endpoint code
# to see that fields are correct. a successful login should yield a non '-1' userId value
POST_login_success_1() {

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

