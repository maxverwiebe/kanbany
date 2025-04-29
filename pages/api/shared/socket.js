import { Server } from "socket.io";
import pool from "@/lib/Database";
import bcrypt from "bcrypt";

export default function handler(req, res) {
  console.log("Socket handler called");
  if (!res.socket.server.io) {
    console.log("Socket server not initialized, creating new one");
    const io = new Server(res.socket.server, {
      path: "/api/shared/socket",
    });
    res.socket.server.io = io;

    const boardUsers = new Map();

    io.on("connection", (socket) => {
      console.log("→ Client verbunden:", socket.id);
      let currentBoardId = null;

      socket.on("joinBoard", async ({ boardId, password }) => {
        console.log(`→ ${socket.id} versucht beizutreten: ${boardId}`);

        const { rows } = await pool.query(
          "SELECT password FROM boards WHERE id = $1",
          [boardId]
        );
        if (rows.length === 0) {
          socket.emit("joinError", "Board not found");
          return;
        }

        const hash = rows[0].password;
        const valid = hash ? await bcrypt.compare(password, hash) : true;
        if (!valid) {
          socket.emit("joinError", "Invalid password");
          return;
        }

        if (currentBoardId) {
          socket.leave(currentBoardId);
          const users = boardUsers.get(currentBoardId) || new Set();
          users.delete(socket.id);
          io.to(currentBoardId).emit("userCount", users.size);
        }

        socket.join(boardId);
        currentBoardId = boardId;
        if (!boardUsers.has(boardId)) boardUsers.set(boardId, new Set());
        boardUsers.get(boardId).add(socket.id);
        io.to(boardId).emit("userCount", boardUsers.get(boardId).size);

        console.log(`→ ${socket.id} joined room ${boardId}`);
      });

      socket.on("disconnect", () => {
        console.log("← Client disconnected:", socket.id);

        if (currentBoardId && boardUsers.has(currentBoardId)) {
          const users = boardUsers.get(currentBoardId);
          users.delete(socket.id);
          io.to(currentBoardId).emit("userCount", users.size);

          if (users.size === 0) {
            boardUsers.delete(currentBoardId);
          }
        }
      });
    });
  }
  res.end();
}
