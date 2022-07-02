# TinyApp

TinyApp is a copy of common URL shorteners, such as TinyURL, Bitly.
Used to shorten lengthy URLs to allow for easier sharing, or usage, and avoid typing or memorizing a long URL.

This app is intended to be locally hosted and therefore before using the app, you must set up and run the server code which can be found in this repo.

## Getting Started

- Pull all code from this repo and ensure all dependencies are installed correctly.
- Run the server using the `npm run dev` command while inside the TinyApp root folder.
- Within your web browser of choice navigate to the homepage by visiting http://localhost:8080/urls
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
