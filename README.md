# steamapi.cloudno.de
Web service that returns steam API query results in JSON format

## Accepted request query fields
* **appid**: steam AppID of game
* **addr**: IP of server

## Success response
_Status 200 application/json_  
Object. Return value of [ISteamApps/GetServerList](https://steamapi.xpaw.me/#ISteamApps/GetServerList) interface.

## Error response
_Status 404 application/json_  
Object. Has a single `error` field with string value.

## Examples
```
https://steamapi.cloudno.de/?appid=107410&addr=85.190.148.62
https://steamapi.cloudno.de/?appid=107410&addr=149.202.86.84
```
