"use client";

import { io } from "socket.io-client";

export const socket = io("https://socket.kanbany.app", {
  path: "/socket.io",
  autoConnect: true,
});
