import { executeQuery } from "../db.js";

export async function register(email, name, password) {
  const { rows } = await executeQuery(`SELECT * FROM register_user($1, $2, $3)`, [email, name, password]);

  return rows[0];
}

export async function findUserByEmail(email) {
  if (!email) return null;

  const { rows } = await executeQuery(`SELECT * FROM users WHERE email = $1`, [email]);

  return rows[0];
}

export async function findUserById(id) {
  if (!id) return null;

  const { rows } = await executeQuery(`SELECT * FROM users WHERE id = $1`, [id]);

  return rows[0];
}
