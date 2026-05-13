"""Баланс пользователя, история покупок и вывод средств с комиссией 3%."""
import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")
COMMISSION_RATE = 0.03
MIN_WITHDRAWAL = 50.00

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
        params = event.get("queryStringParameters") or {}
        user_id = params.get("user_id")
        if not user_id:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "user_id required"})}

        cur.execute(f"SELECT balance FROM {SCHEMA}.users WHERE id=%s", (user_id,))
        row = cur.fetchone()
        if not row:
            return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "User not found"})}

        cur.execute(f"""
            SELECT p.id, g.title, p.price, p.purchased_at
            FROM {SCHEMA}.purchases p
            JOIN {SCHEMA}.games g ON g.id = p.game_id
            WHERE p.user_id=%s ORDER BY p.purchased_at DESC LIMIT 20
        """, (user_id,))
        purchases = [{"id": r[0], "title": r[1], "price": float(r[2]), "date": r[3].isoformat()} for r in cur.fetchall()]

        cur.execute(f"SELECT id, amount, commission, amount_after_commission, method, status, created_at FROM {SCHEMA}.withdrawals WHERE user_id=%s ORDER BY created_at DESC LIMIT 10", (user_id,))
        withdrawals = [{"id": r[0], "amount": float(r[1]), "commission": float(r[2]), "received": float(r[3]), "method": r[4], "status": r[5], "date": r[6].isoformat()} for r in cur.fetchall()]

        return {"statusCode": 200, "headers": headers, "body": json.dumps({"balance": float(row[0]), "purchases": purchases, "withdrawals": withdrawals})}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        user_id = body.get("user_id")
        amount = float(body.get("amount") or 0)
        method_pay = body.get("method") or ""

        if not user_id or not method_pay:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "user_id and method required"})}
        if amount < MIN_WITHDRAWAL:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": f"Minimum withdrawal is {MIN_WITHDRAWAL}₽"})}

        cur.execute(f"SELECT balance FROM {SCHEMA}.users WHERE id=%s", (user_id,))
        row = cur.fetchone()
        if not row:
            return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "User not found"})}
        if float(row[0]) < amount:
            return {"statusCode": 402, "headers": headers, "body": json.dumps({"error": "Insufficient balance"})}

        commission = round(amount * COMMISSION_RATE, 2)
        after_commission = round(amount - commission, 2)

        cur.execute(f"UPDATE {SCHEMA}.users SET balance = balance - %s WHERE id=%s", (amount, user_id))
        cur.execute(f"""
            INSERT INTO {SCHEMA}.withdrawals (user_id, amount, commission, amount_after_commission, method, status)
            VALUES (%s, %s, %s, %s, %s, 'pending') RETURNING id
        """, (user_id, amount, commission, after_commission, method_pay))
        withdrawal_id = cur.fetchone()[0]
        cur.execute(f"SELECT balance FROM {SCHEMA}.users WHERE id=%s", (user_id,))
        new_balance = float(cur.fetchone()[0])
        conn.commit()

        return {"statusCode": 200, "headers": headers, "body": json.dumps({
            "success": True,
            "withdrawal_id": withdrawal_id,
            "amount": amount,
            "commission": commission,
            "received": after_commission,
            "new_balance": new_balance
        })}

    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}
