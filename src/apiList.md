# Current Project APIs

# we'll be creating the router handler and grouping the similar apis in under one Route name somethinglike that.

## Auth APIs

POST /signup done
POST /login done
POST /logout done

## Profile APIs

GET /profile/view done
PATCH /profile/edit done
PATCH /profile/password //forgot password api

## UserRouter

GET /user/feed - Gets you all the available profile
GET /user/connections
GET /user/Requests

## connectionRequestRouters

GET /request/send/interact/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:connectioRequestId
POST /request/review/rejected/:connectionRequestId
