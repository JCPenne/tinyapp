# TinyApp

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

This app is intended to be locally hosted and therefore before using the app, you must set up and run the server code which can be found in this repo.

## Final Product

![Create TinyURL](/screenshots/Create%20TinyURL.png?raw=true "Create Tiny URL")
![View and Edit TinyURL](/screenshots/View%20and%20Edit%20TinyURL.png?raw=true "View and Edit TinyURL")
![List of TinyURLS](/screenshots/List%20of%20TinyURLS.png?raw=true "List of TinyURLs")

## Dependencies
- Bcryptjs
- Body-parser
- Cookie-session
- Ejs
- Express
- Method-override
- Morgan
## Dev Dependencies
- Chai
- Mocha
- Nodemon
## Getting Started

- Install all dependencies using the `node -i` command
  - Install all dev dependencies using the `node -i --save-dev` command
- Run the server using the `npm run dev` command while inside the TinyApp root folder.
- Within your web browser of choice navigate to the homepage by visiting http://localhost:8080/home
- Register your account with an email and password.
- Now you can start creating your own short URLs!

## Possible Routes

### Gets

- localhost:8080/urls
- localhost:8080/urls/register
- localhost:8080/urls/login
- localhost:8080/urls/new
- localhost:8080/urls/:shortURL
- localhost:8080/u/:shortURL

### Posts

- localhost:8080/urls/
- localhost:8080/urls/register
- localhost:8080/urls/login
- localhost:8080/urls/logout

### Deletes

- localhost:8080/urls/:shortURL

### Puts

- localhost:8080/urls/:shortURL

## Correct Server Bootup Example

![Server Start up](/screenshots/TinyAppScreenshot.png?raw=true "Server Start Up")
