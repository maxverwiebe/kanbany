import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import pool from "@/lib/Database";
import RateLimiter from "@/lib/RateLimiter";

const limiter = new RateLimiter({ windowMs: 60_000, max: 40 });
const SOCKET_PUSH_URL =
  process.env.SOCKET_PUSH_URL ?? "https://socket.kanbany.app/push-update";

setInterval(() => {
  limiter.cleanup();
}, limiter.windowMs);

export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (!limiter.isAllowed(ip)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const {
    query: { id: boardId },
  } = req;

  if (req.method === "GET") {
    try {
      const { rows } = await pool.query(
        "SELECT data, password, name, expire_at FROM boards WHERE id = $1",
        [boardId]
      );

      if (rows.length === 0)
        return res.status(404).json({ error: "Board not found" });

      const { data, password, name, expire_at } = rows[0];
      const xBoardPassword = req.headers["x-board-password"];

      if (password && !xBoardPassword)
        return res.status(400).json({ error: "Password header missing" });

      const pwValid = password
        ? await bcrypt.compare(xBoardPassword, password)
        : true;
      if (!pwValid) return res.status(401).json({ error: "Invalid password" });

      return res
        .status(200)
        .json({ data, name: name || "n/A", expires_at: expire_at });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error " + err.message });
    }
  }

  if (req.method === "POST") {
    const {
      data: boardData,
      password,
      updateId: bodyUpdateId,
    } = req.body ?? {};
    if (!boardId || !boardData)
      return res.status(400).json({ error: "Missing required fields" });

    const updateId = bodyUpdateId || uuidv4();

    try {
      await pool.query(
        `INSERT INTO boards (id, data, password)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
        [boardId, boardData, password || null]
      );

      try {
        await fetch(SOCKET_PUSH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ boardId, boardData, updateId }),
        });
      } catch (pushErr) {
        console.warn("Push‑Update failed", pushErr);
      }

      return res.status(201).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end();
}
