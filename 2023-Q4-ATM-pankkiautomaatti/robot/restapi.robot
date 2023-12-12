*** Settings ***
Documentation    REST API - Crud operations
Library          RequestsLibrary
Library          DateTime
Library          Collections

*** Variables ***
${BASE_URL}     http://localhost:3000
${headers}      Content-Type=application/json

*** Test Cases ***
# Muuten suoriutuu hienosti, mutta 
# Delete Card: tarttuu rajoituksiin (accountuser?)

Test GET All Accounts
    ${response}   GET   ${BASE_URL}/account
    Should Be Equal As Numbers    ${response.status_code}    200
    Log    ${response.json()}

Test GET One Account
    ${response}   GET   ${BASE_URL}/account/1
    Should Be Equal As Numbers    ${response.status_code}    200
    Log    ${response.json()}

Test POST aka Add Account
    ${data}       Create Dictionary    account_nmbr=RFW Test    bank_name=RFW Test    account_type=admin    balance=0    max_withdrawal_per_day=0    credit_limit=0
    Set To Dictionary    ${data}

    ${response}   POST   ${BASE_URL}/account  json=${data}
    Should Be Equal As Numbers    ${response.status_code}    200

Test PUT aka Update Account
    ${data}       Create Dictionary    account_nmbr=Updated    bank_name=RFW Test    account_type=admin    balance=0    max_withdrawal_per_day=0    credit_limit=0

    ${latest_account_id}   Get Latest Account ID

    ${response}   PUT   ${BASE_URL}/account/${latest_account_id}    json=${data}
    Should Be Equal As Numbers    ${response.status_code}    200

Test DELETE Account
    ${latest_account_id}   Get Latest Account ID
    ${response}   DELETE   ${BASE_URL}/account/${latest_account_id}
    Log    ${response.json()}

Test GET All Cards
    ${response}   GET   ${BASE_URL}/card
    Should Be Equal As Numbers    ${response.status_code}    200
    Log    ${response.json()}

Test GET One Card
    ${response}   GET   ${BASE_URL}/card/1
    Should Be Equal As Numbers    ${response.status_code}    200
    Log    ${response.json()}

Test POST aka Add Card
    ${data}       Create Dictionary    type=debit    pin=1111    id_user=50    attempts=0
    Set To Dictionary    ${data}

    ${response}   POST   ${BASE_URL}/card  json=${data}
    Should Be Equal As Numbers    ${response.status_code}    200

Test PUT aka Update Card
    ${data}       Create Dictionary    type=debit    pin=1111    id_user=50    attempts=01

    ${latest_card_id}   Get Latest Card ID

    ${response}   PUT   ${BASE_URL}/card/${latest_card_id}     json=${data}
    Should Be Equal As Numbers    ${response.status_code}    200

Test DELETE Card
    ${latest_card_id}   Get Latest Card ID
    ${response}   DELETE   ${BASE_URL}/card/${latest_card_id} 
    Log    ${response.json()}

Test GET All Users
    ${response}   GET   ${BASE_URL}/user
    Should Be Equal As Numbers    ${response.status_code}    200
    Log    ${response.json()}

Test GET One User
    ${response}   GET   ${BASE_URL}/user/1
    Should Be Equal As Numbers    ${response.status_code}    200
    Log    ${response.json()}

Test POST aka Add User
    ${data}       Create Dictionary    firstname=TEST FNAME    lastname=TEST LNAME    address=TEST ADDRESS    city=TEST CITY
    Set To Dictionary    ${data}

    ${response}   POST   ${BASE_URL}/user  json=${data}
    Should Be Equal As Numbers    ${response.status_code}    200

Test PUT aka Update User
    ${data}       Create Dictionary    firstname=TEST FNAME    lastname=TEST LNAME    address=Updated ADDRESS    city=Updated CITY

    ${latest_user_id}   Get Latest User ID

    ${response}   PUT   ${BASE_URL}/user/${latest_user_id}    json=${data}
    Should Be Equal As Numbers    ${response.status_code}    200

Test DELETE User
    ${latest_user_id}   Get Latest User ID
    ${response}   DELETE   ${BASE_URL}/user/${latest_user_id}
    Log    ${response.json()}
    
Test GET All Automats
    ${response}   GET   ${BASE_URL}/automat
    Should Be Equal As Numbers    ${response.status_code}    200
    Log    ${response.json()}

Test GET One Automat
    ${response}   GET   ${BASE_URL}/automat/1
    Should Be Equal As Numbers    ${response.status_code}    200
    Log    ${response.json()}

Test POST aka Add Automat
    ${data}       Create Dictionary    balance_10=5    balance_20=5    balance=50=5    balance_100=5    max_withdrawal=200
    Set To Dictionary    ${data}

    ${response}   POST   ${BASE_URL}/automat  json=${data}
    Should Be Equal As Numbers    ${response.status_code}    200

Test PUT aka Update Automat
    ${data}       Create Dictionary    balance_10=5    balance_20=5    balance=50=5    balance_100=5    max_withdrawal=500

    ${latest_automat_id}   Get Latest Automat ID

    ${response}   PUT   ${BASE_URL}/automat/${latest_automat_id}    json=${data}
    Should Be Equal As Numbers    ${response.status_code}    200

Test DELETE Automat
    ${latest_automat_id}   Get Latest Automat ID
    ${response}   DELETE   ${BASE_URL}/automat/${latest_automat_id}
    Log    ${response.json()}

Test GET All Events
    ${response}   GET   ${BASE_URL}/eventLog 
    Log    ${response.json()}
    
Test GET One Event
    ${response}   GET   url=${BASE_URL}/eventLog?id=1
    Log    ${response.json()}

Test POST Add Event 
    ${headers}    Create Dictionary    Content-Type=application/json
    ${data}       Create Dictionary    id_automat=1    id_account=50    id_card=21    event_type=Robot Test    amount=0
    ${current_time}    Get Current Date    result_format=%Y-%m-%d %H:%M:%S
    Set To Dictionary    ${data}    time=${current_time}

    ${response}   POST   ${BASE_URL}/eventLog  json=${data}    headers=${headers}    expected_status=200
    
    Log    ${response.json()}

Test INVALID POST Data One Column Missing
    ${headers}    Create Dictionary    Content-Type=application/json
    ${data}       Create Dictionary   id_account=50    id_card=21    event_type=Robot Test    amount=120
    ${current_time}    Get Current Date    result_format=%Y-%m-%d %H:%M:%S
    Set To Dictionary    ${data}    time=${current_time}

    ${response}   POST   ${BASE_URL}/eventLog  json=${data}    headers=${headers}    expected_status=400
    
    Log    ${response.json()}

*** Keywords ***

Get Latest Account ID
    ${account_id}    Get Latest ID    account  id_account
    [Return]    ${account_id}

Get Latest Card ID
    ${card_id}    Get Latest ID    card  id_card
    [Return]    ${card_id}

Get Latest User ID
    ${user_id}    Get Latest ID    user  id_user
    [Return]    ${user_id}
    
Get Latest Automat ID
    ${automat_id}    Get Latest ID    automat  id_automat
    [Return]    ${automat_id}

Get Latest Event ID
    ${event_id}    Get Latest ID    event  id_event
    [Return]    ${uevent_id}

Get Latest ID
    [Arguments]    ${endpoint}    ${idField}
    ${response}   GET   ${BASE_URL}/${endpoint}/
    ${object}    Set Variable   ${response.json()}[-1]
    ${objectId}   Set Variable   ${object['${idField}']}

    Log    ${objectId}
    [Return]    ${objectId}