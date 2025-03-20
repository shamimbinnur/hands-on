# Volunteer Platform API Documentation

## Overview

This documentation provides details for all available API endpoints in the volunteer platform application. The API is organized around RESTful principles and uses standard HTTP response codes and authentication.

## Base URL

```
https://api.volunteerhub.com/api
```

## Authentication

Most endpoints require authentication. To authenticate, include a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN
```

Tokens are obtained through the authentication endpoints (`/api/auth/login` or `/api/auth/register`).

## Response Format

All responses are returned in JSON format. Successful responses typically include the requested data or a success message. Error responses include an error message.

---

## Authentication API

### Register User

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Access:** Public
- **Description:** Register a new user
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response:**
  - **Code:** 201 Created
  - **Content:**
    ```json
    {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "token": "jwt-token"
    }
    ```
- **Error Responses:**
  - **Code:** 400 Bad Request
    - **Content:** `{ "message": "User already exists" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Login User

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Access:** Public
- **Description:** Authenticate user and get token
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "token": "jwt-token"
    }
    ```
- **Error Responses:**
  - **Code:** 401 Unauthorized
    - **Content:** `{ "message": "Invalid email or password" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Get Current User

- **URL:** `/api/auth/me`
- **Method:** `GET`
- **Access:** Private
- **Description:** Get current user profile
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** User object
- **Error Response:**
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

---

## Users API

### Get All Users

- **URL:** `/api/users`
- **Method:** `GET`
- **Access:** Private
- **Description:** Get a list of all users
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Array of user objects
- **Error Response:**
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Get User by ID

- **URL:** `/api/users/:id`
- **Method:** `GET`
- **Access:** Public
- **Description:** Get a specific user's profile
- **URL Parameters:**
  - `id`: User ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** User object
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "User not found" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Update User

- **URL:** `/api/users/:id`
- **Method:** `PUT`
- **Access:** Private
- **Description:** Update user profile
- **URL Parameters:**
  - `id`: User ID
- **Request Body:**
  ```json
  {
    "name": "Updated Name",
    "bio": "About me",
    "skills": ["coding", "teaching"],
    "causes": ["education", "environment"],
    "profileImage": "profile.jpg",
    "password": "newpassword"
  }
  ```
  Note: All fields are optional
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Updated user object
- **Error Responses:**
  - **Code:** 401 Unauthorized
    - **Content:** `{ "message": "Not authorized to update this profile" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Get User Volunteer History

- **URL:** `/api/users/:id/history`
- **Method:** `GET`
- **Access:** Public
- **Description:** Get user's volunteer logs
- **URL Parameters:**
  - `id`: User ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Array of volunteer log objects
- **Error Response:**
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

---

## Help Requests API

### Get All Help Requests

- **URL:** `/api/help-requests`
- **Method:** `GET`
- **Access:** Public
- **Description:** Get a list of help requests
- **Query Parameters:**
  - `urgencyLevel`: Filter by urgency (optional)
  - `status`: Filter by status (optional)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "helpRequests": [array of help request objects],
      "pagination": {
        "total": 100,
        "page": 1,
        "limit": 10,
        "totalPages": 10,
        "hasNext": true,
        "hasPrev": false
      }
    }
    ```
- **Error Response:**
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Get Help Request by ID

- **URL:** `/api/help-requests/:id`
- **Method:** `GET`
- **Access:** Public
- **Description:** Get details of a specific help request
- **URL Parameters:**
  - `id`: Help request ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Help request object
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "Help request not found" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Create Help Request

- **URL:** `/api/help-requests`
- **Method:** `POST`
- **Access:** Private
- **Description:** Create a new help request
- **Request Body:**
  ```json
  {
    "title": "Help with garden project",
    "description": "Need assistance with community garden",
    "urgencyLevel": "high"
  }
  ```
  Note: `urgencyLevel` is optional (default: "medium")
- **Success Response:**
  - **Code:** 201 Created
  - **Content:** Created help request object
- **Error Response:**
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Update Help Request

- **URL:** `/api/help-requests/:id`
- **Method:** `PUT`
- **Access:** Private
- **Description:** Update a help request
- **URL Parameters:**
  - `id`: Help request ID
- **Request Body:**
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "urgencyLevel": "low",
    "status": "in-progress"
  }
  ```
  Note: All fields are optional
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Updated help request object
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "Help request not found" }`
  - **Code:** 401 Unauthorized
    - **Content:** `{ "message": "Not authorized to update this request" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Delete Help Request

- **URL:** `/api/help-requests/:id`
- **Method:** `DELETE`
- **Access:** Private
- **Description:** Delete a help request
- **URL Parameters:**
  - `id`: Help request ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "message": "Help request removed" }`
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "Help request not found" }`
  - **Code:** 401 Unauthorized
    - **Content:** `{ "message": "Not authorized to delete this request" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Offer Help

- **URL:** `/api/help-requests/:id/offer-help`
- **Method:** `POST`
- **Access:** Private
- **Description:** Offer to help with a request
- **URL Parameters:**
  - `id`: Help request ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "message": "Successfully offered help" }`
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "Help request not found" }`
  - **Code:** 400 Bad Request
    - **Content:** `{ "message": "This request is [status]" }`
    - **Content:** `{ "message": "Already offering help for this request" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Withdraw Help

- **URL:** `/api/help-requests/:id/withdraw-help`
- **Method:** `POST`
- **Access:** Private
- **Description:** Withdraw offer to help
- **URL Parameters:**
  - `id`: Help request ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "message": "Successfully withdrew help" }`
- **Error Responses:**
  - **Code:** 400 Bad Request
    - **Content:** `{ "message": "Not offering help for this request" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

---

## Events API

### Get All Events

- **URL:** `/api/events`
- **Method:** `GET`
- **Access:** Public
- **Description:** Get a list of events
- **Query Parameters:**
  - `category`: Filter by category (optional)
  - `status`: Filter by status (optional)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "events": [array of event objects],
      "pagination": {
        "total": 100,
        "page": 1,
        "limit": 10,
        "totalPages": 10,
        "hasNext": true,
        "hasPrev": false
      }
    }
    ```
- **Error Response:**
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Get Event by ID

- **URL:** `/api/events/:id`
- **Method:** `GET`
- **Access:** Public
- **Description:** Get details of a specific event
- **URL Parameters:**
  - `id`: Event ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Event object with attendees and teams
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "Event not found" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Create Event

- **URL:** `/api/events`
- **Method:** `POST`
- **Access:** Private
- **Description:** Create a new event
- **Request Body:**
  ```json
  {
    "title": "Beach Cleanup",
    "description": "Community beach cleanup event",
    "category": "environment",
    "date": "2023-08-15",
    "time": "09:00 AM",
    "address": "123 Beach Rd",
    "latitude": 34.052235,
    "longitude": -118.243683,
    "maxAttendees": 30,
    "imageUrl": "beach-cleanup.jpg"
  }
  ```
  Note: `latitude`, `longitude`, `maxAttendees`, and `imageUrl` are optional
- **Success Response:**
  - **Code:** 201 Created
  - **Content:** Created event object
- **Error Response:**
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Update Event

- **URL:** `/api/events/:id`
- **Method:** `PUT`
- **Access:** Private
- **Description:** Update an event
- **URL Parameters:**
  - `id`: Event ID
- **Request Body:**
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "category": "education",
    "date": "2023-08-20",
    "time": "10:00 AM",
    "address": "Updated address",
    "status": "completed"
  }
  ```
  Note: All fields are optional
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Updated event object
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "Event not found" }`
  - **Code:** 401 Unauthorized
    - **Content:** `{ "message": "Not authorized to update this event" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Delete Event

- **URL:** `/api/events/:id`
- **Method:** `DELETE`
- **Access:** Private
- **Description:** Delete an event
- **URL Parameters:**
  - `id`: Event ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "message": "Event removed" }`
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "Event not found" }`
  - **Code:** 401 Unauthorized
    - **Content:** `{ "message": "Not authorized to delete this event" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Join Event

- **URL:** `/api/events/:id/join`
- **Method:** `POST`
- **Access:** Private
- **Description:** Join an event
- **URL Parameters:**
  - `id`: Event ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "message": "Successfully joined event" }`
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "Event not found" }`
  - **Code:** 400 Bad Request
    - **Content:** `{ "message": "Event is full" }`
    - **Content:** `{ "message": "Already joined this event" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Leave Event

- **URL:** `/api/events/:id/leave`
- **Method:** `POST`
- **Access:** Private
- **Description:** Leave an event
- **URL Parameters:**
  - `id`: Event ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "message": "Successfully left event" }`
- **Error Responses:**
  - **Code:** 400 Bad Request
    - **Content:** `{ "message": "Not attending this event" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Check Join Status

- **URL:** `/api/events/:id/joined`
- **Method:** `GET`
- **Access:** Private
- **Description:** Check if user has joined an event
- **URL Parameters:**
  - `id`: Event ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "joined": true,
      "attendance": {
        "id": "attendance-id",
        "userId": "user-id",
        "eventId": "event-id",
        "createdAt": "2023-07-15T10:30:00Z"
      }
    }
    ```
- **Error Response:**
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

---

## Teams API

### Get All Teams

- **URL:** `/api/teams`
- **Method:** `GET`
- **Access:** Public
- **Description:** Get a list of teams
- **Query Parameters:**
  - `isPublic`: Filter for public/private teams (optional)
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Array of team objects
- **Error Response:**
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Get Team by ID

- **URL:** `/api/teams/:id`
- **Method:** `GET`
- **Access:** Public
- **Description:** Get details of a specific team
- **URL Parameters:**
  - `id`: Team ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Team object with members and events
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "Team not found" }`
  - **Code:** 403 Forbidden
    - **Content:** `{ "message": "This team is private" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Create Team

- **URL:** `/api/teams`
- **Method:** `POST`
- **Access:** Private
- **Description:** Create a new team
- **Request Body:**
  ```json
  {
    "name": "Environmental Heroes",
    "description": "Team focused on environmental projects",
    "isPublic": true,
    "teamImage": "team-image.jpg"
  }
  ```
  Note: `isPublic` and `teamImage` are optional
- **Success Response:**
  - **Code:** 201 Created
  - **Content:** Created team object
- **Error Responses:**
  - **Code:** 400 Bad Request
    - **Content:** `{ "message": "Team name already exists" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Update Team

- **URL:** `/api/teams/:id`
- **Method:** `PUT`
- **Access:** Private
- **Description:** Update a team
- **URL Parameters:**
  - `id`: Team ID
- **Request Body:**
  ```json
  {
    "name": "Updated team name",
    "description": "Updated description",
    "isPublic": false,
    "teamImage": "updated-image.jpg"
  }
  ```
  Note: All fields are optional
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Updated team object
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "Team not found" }`
  - **Code:** 401 Unauthorized
    - **Content:** `{ "message": "Not authorized to update this team" }`
  - **Code:** 400 Bad Request
    - **Content:** `{ "message": "Team name already exists" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Delete Team

- **URL:** `/api/teams/:id`
- **Method:** `DELETE`
- **Access:** Private
- **Description:** Delete a team
- **URL Parameters:**
  - `id`: Team ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "message": "Team removed" }`
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "Team not found" }`
  - **Code:** 401 Unauthorized
    - **Content:** `{ "message": "Not authorized to delete this team" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Join Team

- **URL:** `/api/teams/:id/join`
- **Method:** `POST`
- **Access:** Private
- **Description:** Join a team
- **URL Parameters:**
  - `id`: Team ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "message": "Successfully joined team" }`
- **Error Responses:**
  - **Code:** 404 Not Found
    - **Content:** `{ "message": "Team not found" }`
  - **Code:** 403 Forbidden
    - **Content:** `{ "message": "Cannot join a private team without invitation" }`
  - **Code:** 400 Bad Request
    - **Content:** `{ "message": "Already a member of this team" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`

### Leave Team

- **URL:** `/api/teams/:id/leave`
- **Method:** `POST`
- **Access:** Private
- **Description:** Leave a team
- **URL Parameters:**
  - `id`: Team ID
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "message": "Successfully left team" }`
- **Error Responses:**
  - **Code:** 400 Bad Request
    - **Content:** `{ "message": "Not a member of this team" }`
    - **Content:** `{ "message": "Team creator cannot leave the team. Transfer ownership or delete the team instead." }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "message": "Error message" }`
