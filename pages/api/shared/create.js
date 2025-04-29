import { v4 as uuid } from "uuid";
import pool from "@/lib/Database";
import bcrypt from "bcrypt";

const limiter = new RateLimiter({ windowMs: 60_000, max: 2 });

setInterval(() => {
  limiter.cleanup();
}, limiter.windowMs);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (!limiter.isAllowed(ip)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  try {
    const {
      name,
      password = null,
      expiration,
      importLocal,
      data: clientData,
    } = req.body;

    if (!name || !expiration || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (name.length > 100) {
      return res.status(400).json({ error: "Name is too long" });
    }

    if (password.length > 100) {
      return res.status(400).json({ error: "Password is too long" });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const id = uuid();

    let expireAt = null;
    if (expiration !== "permanent") {
      const days = parseInt(expiration, 10);
      const now = new Date();
      expireAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    }

    const initialData =
      importLocal && clientData
        ? clientData
        : { columns: [], cards: [], labels: [] };

    await pool.query(
      `INSERT INTO boards (id, name, data, password, expire_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, name, initialData, hashedPassword, expireAt]
    );

    return res.status(201).json({
      id,
      url: `/shared/${id}`,
      expires: expireAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
}
