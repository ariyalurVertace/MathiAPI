/* eslint-disable promise/prefer-await-to-callbacks */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import {Server} from "socket.io";
import redisAdapter from "socket.io-redis";

import {
    redisHost,
    redisPort,
    redisPassword,
    redisPrefix,
    secretKey,
} from "../../config/environment.js";

//import {socketLister} from "../custom/socket_controller.js";

export async function initializeSocketServer(server) {
    const socketio = new Server(server, {
        cors: {
            origin: "*",
            credentials: true,
        },
    });
    socketio.adapter(
        redisAdapter({
            host: redisHost,
            port: redisPort,
            //  password: redisPassword,
        }),
    );

    socketio.sockets.on("connection", socket => {
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(
                socket.handshake.query.token,
                secretKey,
                (err, decoded) => {
                    if (err) {
                        onAuthenticationFailure(socketio, socket);
                    } else {
                        socket.decoded = decoded;
                        onAuthenticationSuccess(socketio, socket);
                    }
                },
            );
        }
    });
}

export async function onAuthenticationSuccess(io, socket) {
    socket.emit("authentication_success");
    socketLister(io, socket);
}

export async function onAuthenticationFailure(io, socket) {
    socket.emit("authentication_failure");
    socket.disconnect();
}
