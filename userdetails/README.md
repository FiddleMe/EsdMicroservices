endpoints that require authentication should use requiresAuth() within the request. see http://localhost:3000/islogin as an example.

if port name has to be changed, contact me
http://localhost:3000/, GET
content

http://localhost:3000/login, GET
login or signup user

http://localhost:3000/logout, GET
logout user

http://localhost:3000/profile, GET
displays profile
profile format:
{"nickname":"testuserderic",
"name":"testuserderic@gmail.com",
"picture":"https://s.gravatar.com/avatar/096e5ed8479f97e33db528fc8b1d599f?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png",
"updated_at":"2023-03-29T08:06:17.642Z",
"email":"testuserderic@gmail.com",
"email_verified":false,
"sub":"auth0|641abca8f939365a568eb569",
"sid":"jef90Zz169wQm81Zyf-kQofxykeYt1WZ"}

references:
https://auth0.github.io/express-openid-connect/
https://auth0.com/blog/auth0-s-express-openid-connect-sdk/

To begin:
1. open folder in terminal
2. run npm install
3. run node authentication.js
4. U should see an output like this: Using 'form_post' for response_mode may cause issues for you logging in over http, see https://github.com/auth0/express-openid-connect/blob/master/FAQ.md
Example app listening on port 3000
5. We have 2 acocunts u can login as a customer
email: tiffanyhujiahui@gmail.com 
password: 123*gmail
email: ksitishareefa14@gmail.com 
password: Esd123456*
6. To signup, please note you need to use a real email