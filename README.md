﻿# Apni-Dukaan-Backend
 Backend repository for social media web app using ExpressJS connected to MongoDB through Mongoose.

password encrypted.
Authentication with JWT token.
Instant encrypted messaging with Socket.io

#List of API endpoints
Users
POST /users/login - Takes username and password as a parameter and returns JWT.
POST /users/signup - Providing name, username, password, and email would add a new user into the database.
POST /users/follow - Take targetId(followed user) and sourceId(following user).
POST /users/unfollow - Take targetId(followed user) and sourceId(following user).
GET /users/:userId - fetch single user info.
GET /users/feed/:userId - fetch user feed.
GET /users/followers - fetch user followers.
GET /users/following - fetch user following.
GET /users/get-user-posts - fetch user posts.
PUT /users/update/:userId - update user profile info.
GET /users/notifications/:userId - fetch list of user notifications.
GET /users/search - Search users by name or username.
GET /users/chats/:userId - fetches user's chat recipient list.
GET /users/get-recently-joined-users/:userId - fetches recently joined users.
