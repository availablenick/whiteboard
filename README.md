# Whiteboard
A simple whiteboard application

## Prerequisites
You need to install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/).

## Getting started
Run:

```
$ docker compose up
```

By default, the application uses ports 3000 and 5000, but it is possible to change them by setting the environment variables `$CLIENT_PORT` and `$SERVER_PORT`, respectively.

## Usage

The application have basic tools like pencil, eraser, color picker, an so on.

It is possible to access rooms with their own whiteboard, and every person in the room will share it. For instance, you can access the room 'room' by going to
to the path '/room'. By default, the path '/' is not a shared room, so each person that accesses it will have their own private whiteboard.

The rooms do not keep the whiteboard's state, so basically the state is kept by the people in the room, and therefore, if there is no one in it, the whiteboard's content is lost. Moreover, since there is no stored state, every time a new person enters the room, they need to wait for another person that was already in the room to change the whiteboard, so that the update can be shared between the users.
