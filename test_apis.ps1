$ErrorActionPreference = "Stop"
try {
    $UserResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/users/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Local Test User","email":"local@test.com","phone":"5551234","password":"password"}'
    $UserJson = $UserResponse | ConvertTo-Json -Depth 5

    $AccountResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/accounts?userId=$($UserResponse.id)" -Method POST
    $AccountJson = $AccountResponse | ConvertTo-Json -Depth 5

    $DepositResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/transactions/deposit?accountNumber=$($AccountResponse.accountNumber)&amount=1000" -Method POST
    $DepositJson = $DepositResponse | ConvertTo-Json -Depth 5

    $HistoryResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/transactions/$($AccountResponse.accountNumber)" -Method GET
    $HistoryJson = $HistoryResponse | ConvertTo-Json -Depth 5

    $Output = @"
## Live Testing Results

I ran the application locally and successfully tested the endpoints. Here is the actual live output retrieved from the API:

### 1. Register User Output (POST /api/users/register)
```json
$UserJson
```

### 2. Create Account Output (POST /api/accounts?userId=...)
```json
$AccountJson
```

### 3. Deposit Money Output (POST /api/transactions/deposit)
```json
$DepositJson
```

### 4. Transaction History Output (GET /api/transactions/...)
```json
$HistoryJson
```
"@
    $Output | Out-File -FilePath test_results.md -Encoding utf8
    Write-Output "Testing completed successfully"
} catch {
    Write-Error $_
}
