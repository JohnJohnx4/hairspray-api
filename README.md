# Hairspray

~~CS7 Capstone Project~~ Refactoring of CS7 Labs Projec

### [Heroku link](https://obscure-island-58835.herokuapp.com)

# Routes

## Logging in

#### URL : `/login`

### [POST] | Log in passed in user

```
Required input

{
  "email": "alex@user.com",
  "password": "1234567"
}

Response Body

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
  "user_id": "5cb62ecc4581db3438119a67"
}

```

### URL : `/users/`

#### [GET] | get all current users

```
Response Body
[
  {
    "appointments": [],
    "feedback": [],
    "_id": "5cb62ecc4581db3438119a67",
    "name": "Alex",
    "phone": "1111111111",
    "email": "Alex@user.com",
    "password": "123456",
    "date": "2019-04-16T22:03:31.567Z"
  },
  {
    ...
  }
]

```

### [POST]

create a new user

## Users

#### URL : `/users/:id`

### [GET]

get a specific user

### [POST]

update a specific user

#### URL : `/users/:id`

### [GET]

get a specific user
PUT - update a specific user

## Stylists

#### URL : `/stylist/`

### [GET]

testing route to get a list of all stylists in database

### [POST]

create a new stylist

#### URL : `/stylist/:id`

### [GET]

get a stylist by their id
PUT - updates Stylist by Stylist ID
DELETE - deletes Stylist by Stylist ID

## Appointments

#### URL : `/user/:id/appointments`

### [POST]

create a new Appointment

### [GET]

list all appointments for specific user

#### URL : `/stylist/:id/appointments`

### [GET]

lists all appointments for a Stylist

#### URL : `/appointments/update/:id`

PUT - updates appointment by appointment ID
DELETE - deletes appointment by appointment ID

## Feedback

#### URL : `/feedback`

### [GET]

get all feedback in database

#### URL : `/appointment/:id/feedback`

### [POST]

create new feedback

#### URL : `/user/:id/feedback`

### [GET]

Gets an array of all the Feedback a User has submitted

#### URL : `/stylist/:id/feedback`

### [GET]

Gets an array of all the Feedback a Stylist has received

#### URL : `/feedback/update/:id`

PUT - Updates previously submitted feedback via Feedback ID
DELETE - Deletes Feedback by Feedback ID

## Service

#### URL : `/service`

### [GET]

get all Services in database

### [POST]

create new Service

#### URL : `/service/:id/`

### [GET]

Gets a specific Service

#### URL : `/service/update/:id`

PUT - Updates a Service via Service ID
DELETE - Deletes a Service via Service ID
