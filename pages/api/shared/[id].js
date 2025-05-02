import pool from "@/lib/Database";
import bcrypt from "bcrypt";

import RateLimiter from "@/lib/RateLimiter";

const limiter = new RateLimiter({ windowMs: 60_000, max: 40 });

setInterval(() => {
  limiter.cleanup();
}, limiter.windowMs);

export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (!limiter.isAllowed(ip)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const {
    query: { id },
  } = req;

  if (req.method === "GET") {
    try {
      const { rows } = await pool.query(
        "SELECT data, password, name, expire_at FROM boards WHERE id = $1",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Board not found" });
      }

      const { data, password, name, expire_at } = rows[0];
      const xboardPassword = req.headers["x-board-password"];

      if (password && !xboardPassword) {
        return res.status(400).json({ error: "Password header missing" });
      }

      const passwordValid = password
        ? await bcrypt.compare(xboardPassword, password)
        : null;

      if (!passwordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      return res
        .status(200)
        .json({ data, name: name || "n/A", expires_at: expire_at });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error " + err });
    }
  }

  if (req.method === "POST") {
    const { data, password, updateId } = req.body;
    if (!id || !data) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await pool.query(
        `INSERT INTO boards (id, data, password)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE
           SET data = EXCLUDED.data`,
        [id, data, password || null]
      );

      const io = res.socket.server.io;
      if (io) {
        io.to(id).emit("boardUpdated", {
          boardData: data,
          updateId,
        });
        console.log("Board updated and socket notified " + id);
      }

      return res.status(201).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }
}
