# Current Project APIs

# we'll be creating the router handler and grouping the similar apis in under one Route name somethinglike that.

## Auth APIs

POST /signup done
POST /login done
POST /logout done

## Profile APIs

GET /profile/view done
PATCH /profile/edit done
PATCH /profile/password //forgot password api done
POST /profile/forgot-password done

## UserRouter

GET /user/feed - Gets you all the available profile.
GET /user/connections //getting all the connections.
GET /user/Requests //getting all the requests.

## connectionRequestRouters

GET /request/send/intrested/:userId done
POST /request/send/ignored/:userId done
created combo of both using dynamic route

POST /request/send/:status/:userId done.

POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

doing same with this

POST /request/review/:status/:requestId done.
