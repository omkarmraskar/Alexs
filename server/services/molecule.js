const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const mysql = require("mysql");
const crypto = require("crypto");

async function getMultiple() {
  // const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, Tool_Name, Tool_JSON, Last_Updated, Author FROM molecule  WHERE id > 0`
  );
  // console.log(rows);
  const data = helper.emptyOrRows(rows);
  // const meta = { page };

  return {
    data,
    // meta
  };
}

async function create(molecule) {
  const moleculeData = {
    id: molecule.id,
    Tool_Name: molecule.Tool_Name,
    Tool_JSON: molecule.Tool_JSON ? molecule.Tool_JSON : null,
    Author: molecule.Author,
  };

  const test = `INSERT INTO molecule (Tool_Name, Tool_JSON, Author) VALUES (?, ?, ?)`;
  const values = [
    moleculeData.Tool_Name,
    moleculeData.Tool_JSON,
    moleculeData.Author,
  ];
  const result = await db.query(test, values);
  console.log(test, values);

  let message = "Error in creating Molecule";
  let id;
  if (result.affectedRows) {
    id = `${result.insertId}`;
    message = "Molecule created successfully";
  }
  return { message, id };
}

async function update(id, moleculeJSON) {
  const test = `UPDATE molecule SET Tool_JSON=? WHERE id=?`;
  const values = [moleculeJSON, id];
  const result = await db.query(test, values);
  console.log(test, values);
  let message = "Error in updating molecule";

  if (result.affectedRows) {
    message = "Molecule updated successfully";
  }

  return { message };
}

async function remove(id) {
  const newID = -1 * parseInt(id);
  const test = `UPDATE molecule SET id=? WHERE id=?`;
  const values = [newID, id];
  const result = await db.query(test, values);
  console.log(test, values);
  let message = "Error in deleting molecule";

  if (result.affectedRows) {
    message = "molecule deleted successfully";
  }

  return { message };
}
async function getFromID(id) {
  const test = `SELECT id, Tool_Name, Tool_JSON, Last_Updated, Author FROM molecule WHERE id=?`;
  const values = [id];
  const result = await db.query(test, values);
  console.log(test, values);
  let message = "Error getting molecule";

  if (result.affectedRows) {
    message = "Molecule Acquired successfully";
  }
  const data = helper.emptyOrRows(result);
  return { data };
}

function generateSalt() {
  const salt = crypto.randomBytes(16).toString("hex");
  return salt;
}

async function addUser(username, password) {
  const exists = await checkUsername(username);
  if (exists) {
    return false;
  } else {
    await createUser(username, password);
    return true;
  }
}
async function checkUsername(username) {
  const sql = "SELECT COUNT(*) as count FROM users WHERE username = ?";
  const results = await db.query(sql, [username]);
  const count = results[0].count;
  return count > 0;
}
async function createUser(username, password) {
  const salt = generateSalt();
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");
  const sql =
    "INSERT INTO users (username, salt, hashed_password) VALUES (?, ?, ?)";
  await db.query(sql, [username, salt, hashedPassword]);
}
async function getSalt(username) {
    const query = `SELECT salt FROM users WHERE username = ?`;
    const [rows] = await db.query(query, [username]);
    if (rows.length === 0) {
      throw new Error("Username not found.");
    }
    const salt = rows.salt;
    if (salt){
      return salt;
    }
    else{
      console.error("Error getting salt:");
    }
}
async function checkPassword(username, hashedPassword) {
  try {
    const query = `SELECT hashed_password FROM users WHERE username = ?`;
    const [rows] = await db.query(query, [username]);
    if (rows.length === 0) {
      throw new Error("Username not found.");
    }
    const storedHashedPassword = rows.hashed_password;
    const match = storedHashedPassword === hashedPassword;
    return match;
  } catch (error) {
    console.error("Error checking password:", error);
    throw error;
  }
}
module.exports = {
  getMultiple,
  create,
  getFromID,
  update,
  remove,
  checkUsername,
  addUser,
  checkPassword,
  getSalt,
};
