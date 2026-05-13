"""Список игр и покупка игры пользователем. v2"""
import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "GET, POST, OPTIONS"}
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    method = event.get("httpMethod")
    conn = get_conn()
    cur = conn.cursor()

    if method == "GET":
        cur.execute(f"SELECT id, title, genre, price, steam_id FROM {SCHEMA}.games ORDER BY id")
        rows = cur.fetchall()
        games = [{"id": r[0], "title": r[1], "genre": r[2], "price": float(r[3]), "steam_id": r[4]} for r in rows]
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"games": games})}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        user_id = body.get("user_id")
        game_id = body.get("game_id")
        if not user_id or not game_id:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "user_id and game_id required"})}

        cur.execute(f"SELECT id, price FROM {SCHEMA}.games WHERE id=%s", (game_id,))
        game = cur.fetchone()
        if not game:
            return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Game not found"})}

        cur.execute(f"SELECT balance FROM {SCHEMA}.users WHERE id=%s", (user_id,))
        user = cur.fetchone()
        if not user:
            return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "User not found"})}

        price = game[1]
        if float(user[0]) < float(price):
            return {"statusCode": 402, "headers": headers, "body": json.dumps({"error": "Insufficient balance"})}

        cur.execute(f"SELECT id FROM {SCHEMA}.purchases WHERE user_id=%s AND game_id=%s", (user_id, game_id))
        if cur.fetchone():
            return {"statusCode": 409, "headers": headers, "body": json.dumps({"error": "Already purchased"})}

        cur.execute(f"UPDATE {SCHEMA}.users SET balance = balance - %s WHERE id=%s", (price, user_id))
        cur.execute(f"INSERT INTO {SCHEMA}.purchases (user_id, game_id, price) VALUES (%s, %s, %s)", (user_id, game_id, price))
        cur.execute(f"SELECT balance FROM {SCHEMA}.users WHERE id=%s", (user_id,))
        new_balance = float(cur.fetchone()[0])
        conn.commit()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"success": True, "new_balance": new_balance})}

    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}