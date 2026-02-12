# Current Project APIs

# we'll be creating the router handler and grouping the similar apis in under one Route name somethinglike that.

## Auth APIs
POST /signup
POST /login
POST /logout

## Profile APIs
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

## UserRouter
GET /user/feed - Gets you all the available profile
GET /user/connections
GET /user/Requests

## connectionRequestRouters
GET /request/send/interact/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:connectioRequestId
POST /request/review/rejected/:connectionRequestId








