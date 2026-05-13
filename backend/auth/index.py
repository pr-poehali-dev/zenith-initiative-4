"""Регистрация и вход пользователей. Возвращает user_id и данные профиля."""
import json
import os
import hashlib
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS"}
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")  # "register" or "login"
    username = (body.get("username") or "").strip()
    password = body.get("password") or ""

    if not username or not password:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Username and password required"})}

    pw_hash = hash_password(password)
    conn = get_conn()
    cur = conn.cursor()

    if action == "register":
        try:
            cur.execute(f"INSERT INTO {SCHEMA}.users (username, password_hash, balance) VALUES (%s, %s, 100.00) RETURNING id, username, balance", (username, pw_hash))
            row = cur.fetchone()
            conn.commit()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": row[0], "username": row[1], "balance": float(row[2])})}
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            return {"statusCode": 409, "headers": headers, "body": json.dumps({"error": "Username already taken"})}
    elif action == "login":
        cur.execute(f"SELECT id, username, balance FROM {SCHEMA}.users WHERE username=%s AND password_hash=%s", (username, pw_hash))
        row = cur.fetchone()
        if not row:
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Invalid credentials"})}
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"id": row[0], "username": row[1], "balance": float(row[2])})}
    else:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Unknown action"})}
