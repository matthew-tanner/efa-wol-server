## WOL Test Information

### JSON Structure

Register / Login:

```json
{
  "user":{
    "username": "User",
    "password": "1234"
  }
}
```

Create / Update Log:

(requires session token, provided by /login)

```json
{
  "log": {
    "description": "First Log",
    "definition": "definition data here",
    "result": "result data here"
  }
}
```


## Screenshots
> Registration Success
![registration](./media/register-success.png)

> Registration Duplicate
![registration-failure](./media/register-duplicate.png)

> Login Success
![login-success](./media/login-success.png)

> Login Failure
![login-failure](./media/login-failure.png)

> Create Log Entry
![log-create](./media/log-create.png)

> Get All Logs
![log-get-all](./media/log-get-all.png)

> Get Single Log
![log-get-single](./media/log-get-single.png)

> Get Log Failure
![log-failure](./media/log-get-failure.png)

> Update Log Entry
![log-update](./media/log-update.png)

> Delete Log Entry
![log-delete](./media/log-delete.png)
