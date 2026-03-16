# Online Banking System - Sample API Requests

Here are sample requests you can import into Postman or run via cURL if you are testing the REST APIs.

## 1. User Module

### Register a User
```bash
curl -X POST http://localhost:8080/api/users/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "1234567890",
  "password": "securepassword123"
}'
```

### Login a User
```bash
curl -X POST http://localhost:8080/api/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "jane@example.com",
  "password": "securepassword123"
}'
```

---

## 2. Bank Account Module

### Create Account for User
```bash
curl -X POST "http://localhost:8080/api/accounts?userId=1"
```
*(Assume this creates an account and returns an `accountNumber` like "A1B2C3D4E5")*

### Get Account Details
```bash
curl -X GET http://localhost:8080/api/accounts/A1B2C3D4E5
```

### Get All Accounts for a User
```bash
curl -X GET http://localhost:8080/api/accounts/user/1
```

---

## 3. Transaction Module

### Deposit Money
```bash
curl -X POST "http://localhost:8080/api/transactions/deposit?accountNumber=A1B2C3D4E5&amount=500.00"
```

### Withdraw Money
```bash
curl -X POST "http://localhost:8080/api/transactions/withdraw?accountNumber=A1B2C3D4E5&amount=100.00"
```

### Transfer Money
```bash
curl -X POST http://localhost:8080/api/transactions/transfer \
-H "Content-Type: application/json" \
-d '{
  "fromAccountNumber": "A1B2C3D4E5",
  "toAccountNumber": "F6G7H8I9J0",
  "amount": 150.00
}'
```

### View Transaction History
```bash
curl -X GET http://localhost:8080/api/transactions/A1B2C3D4E5
```
