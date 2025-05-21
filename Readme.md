# 🪙 Wallet System

This is a full-stack wallet system integrated with Monnify (Sandbox), built using Django + React and fully dockerized.

---

## Features

- ✅ JWT-based user auth (Register, Login)
- ✅ Fund wallet via Monnify hosted payment
- ✅ View wallet balance and transaction history

---

## 🚀 Run Instructions

### 1. Clone this repo

```bash
git clone https://github.com/Dudeiebot/grit.git

cd grit
```

### 2. Copy from .env.example and fill in your values.

```bash
cp .env.example .env
```

### 3. Run with Makefile

```bash
make up
```

- Docker will:
  - Start **PostgreSQL**
  - Start **your backend image**
  - Start **your frontend image**
- You wll be able to test the app at `http://localhost` and the api `http://localhost:8000/api/v1`
- You are also going to need `ngrok` for testing Monnify webhooks locally

### 4. Then migrate db

```bash
make migrate
```

### 5. Accessing Ngrok

```bash
ngrok http 8000
```

- go to the Monnify dashboard and attach this urls to the Transaction completion box `https://<url-provided-by-ngrok>/api/v1/wallet/webhook/monnify`
  - start receiving calls
