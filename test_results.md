## Live Testing Results

I ran the application locally and successfully tested the endpoints. Here is the actual live output retrieved from the API:

### 1. Register User Output (POST /api/users/register)
`json
{
    "id":  1,
    "name":  "Local Test User",
    "email":  "local@test.com",
    "phone":  "5551234",
    "password":  null
}
`

### 2. Create Account Output (POST /api/accounts?userId=...)
`json
{
    "id":  1,
    "accountNumber":  "9B286263-D",
    "balance":  0,
    "userId":  1
}
`

### 3. Deposit Money Output (POST /api/transactions/deposit)
`json
{
    "id":  1,
    "amount":  1000,
    "transactionType":  "DEPOSIT",
    "targetAccountNumber":  null,
    "timestamp":  "2026-03-16T11:32:20.8832523",
    "accountId":  1
}
`

### 4. Transaction History Output (GET /api/transactions/...)
`json
{
    "id":  1,
    "amount":  1000.00,
    "transactionType":  "DEPOSIT",
    "targetAccountNumber":  null,
    "timestamp":  "2026-03-16T11:32:20.883252",
    "accountId":  1
}
`
