/* eslint-disable */
/**
 * INTENTIONALLY VULNERABLE CODE — SECURITY PIPELINE CANARY
 * DO NOT IMPORT. DO NOT DEPLOY. DO NOT EXECUTE.
 *
 * Each function below is designed to trip a specific SAST rule.
 */

'use strict';

const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

// 1. Hardcoded credentials (CWE-798)
const DB_PASSWORD = 'SuperSecret123!';
const API_KEY = 'sk_live_51HqjklABCDEF0123456789abcdefGHIJ';

// 2. Use of eval with user input (CWE-95 — code injection)
function runUserExpression(req, res) {
  const expr = req.query.expr;
  const result = eval(expr); // sink
  res.end(String(result));
}

// 3. OS command injection via child_process.exec (CWE-78)
function pingHost(req, res) {
  const host = req.query.host;
  exec('ping -c 1 ' + host, (err, stdout) => { // sink
    res.end(stdout);
  });
}

// 4. Path traversal (CWE-22)
function readUserFile(req, res) {
  const name = req.query.name;
  const full = path.join('/var/data', name); // no normalization check
  fs.readFile(full, 'utf8', (err, data) => { // sink
    res.end(data);
  });
}

// 5. Weak hashing algorithm (CWE-327)
function hashPassword(pw) {
  return crypto.createHash('md5').update(pw).digest('hex'); // sink
}

// 6. Insecure randomness for security token (CWE-338)
function generateSessionToken() {
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += Math.floor(Math.random() * 16).toString(16); // sink
  }
  return token;
}

// 7. SQL injection via string concatenation (CWE-89)
function getUserByName(db, name) {
  const query = "SELECT * FROM users WHERE name = '" + name + "'"; // sink
  return db.query(query);
}

// 8. SSRF — unvalidated outbound request (CWE-918)
function fetchUrl(req, res) {
  const target = req.query.url;
  http.get(target, (upstream) => { // sink
    upstream.pipe(res);
  });
}

// 9. Disabled TLS verification (CWE-295)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 10. ReDoS-prone regex (CWE-1333)
const EMAIL_RE = /^([a-zA-Z0-9]+)+@([a-zA-Z0-9]+)+\.[a-z]{2,}$/;
function validateEmail(e) {
  return EMAIL_RE.test(e);
}

module.exports = {
  DB_PASSWORD,
  API_KEY,
  runUserExpression,
  pingHost,
  readUserFile,
  hashPassword,
  generateSessionToken,
  getUserByName,
  fetchUrl,
  validateEmail,
};
