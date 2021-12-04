# steamapi.cloudno.de

## Accepted request query fields
* **appid**
* **addr**

## Success response
_Status 200 application/json_  
Object. Return value of [ISteamApps/GetServerList](https://steamapi.xpaw.me/#ISteamApps/GetServerList) interface.

## Error response
_Status 404 application/json_  
Object. Has a single `error` field with string value.
