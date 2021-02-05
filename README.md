# School Bank System Project

>  Another overcomplicated school task that I am somehow actually proud of

### The Task

I was assigned in my GCSE Computer Science lesson to write a simple program that would utillise subroutines and variables to make a banking program. Sure.

I, being me, go wildly overboard, and write a full-on CRUD API with SQL support in Node.JS, while making sure to comment almost every line of code.

### My Solution

#### Packages / Dependencies

To write this, I used a variety of carefully picked technologies to make the user, and development experience, as nice as possible. 

The packages I installed, will all be in the [package.json](package.json), which for the unaware is the project (configuration?) file for Node.js and NPM (Node Package Manager), however I am going to list them here, along with a quick explanation of what they do and why they were chosen here:

* [Express.js](https://npmjs.com/package/express)
  
  * This is probably the most crucial package that I have chosen to include in this program. If you are unaware of what it does, it is essentially a wrapper for the built in Node.js HTTP support, that makes the development and user experience as smooth, if not smoother, than butter. I could have used the build in Node HTTP module, however this would have caused the program to feel messier and I find the experience of developing with Express to be much more interesting.
* [EJS](https://npmjs.com/package/ejs)
  
  * EJS stands for Embeded Javascript, and is a library to render HTML markup with data that is dynamically sent from the backend. Essentially meaning that if I wanted, each individual user on the same page could get an entirely different HTML response. As implied by the package name, EJS is not a programming language, it interprets javascript code in the file before it is sent to the client.
* [Sequelize](https://npmjs.com/package/sequelize)
  
  * Sequelize is a module that provides a nice interface between an SQL database, such as SQLite, MariaDB, PostGres, MySQL, etcetera, and the programming environment. The reason that I used it is as it has easy-to-use API functions, that return a Javascript Promise-based asyncronous result, meaning that I can stop further code from running until a database query was completed. An example of this is as follows:
  
    ```Javascript
    // This is the equivelant SQL Query as "SELECT * FROM `users` WHERE `id` = `5` LIMIT 1"
    let user = await User.findOne({
      where: {
        id: 5,
      },
    });
    console.log(user) // This will wait until the above has completed.
    ```

* [SQLite3](https://npmjs.com/package/sqlite3)
  
  * SQLite3 is the database I chose to use for this project. This is because it does not have to be hosted anywhere and I don't have to worry with credentials, as this _is_ just a school project after all. The database has similar SQL syntax to other databases that I have worked with in the past, too. So I thought it would be the perfect fit.

##### DEV DEPENDENCIES

The following dependencies do not need to be installed by anyone unless they are actively developing for the project. This is especially useful for when publishing a project to a remote server, where storage may not be the biggest luxury.

* [Nodemon](https://npmjs.com/package/nodemon)
  * Nodemon (I think,) is a wrapper around the normal `node` command, and is used for automatically restarting the project whenever a file in the project directory receives a **save** signal.
* [CLOC](https://npmjs.com/package/cloc)
  * CLOC, or "Count Lines of Code" pretty much does exactly what it says on the tin. It is a port of a Homebrew command and counts the lines of code in a file. This is not an important dependency whatsoever, however I installed as I felt rather curious.

#### Database

There are two main data points stored in the database, User information and Transaction information.

The user information is: 

```lua
USER
	-> firstName -- The user's first name
	-> lastName -- The user's last name
	-> balance -- The balance of the user
```

and the transaction information is: 

```lua
TRANSACTION
	-> from -- The id of the user who sent the money
	-> to -- The id of the user who received the money
	-> amount -- The amount of money that was sent
```

#### API (Application Programming Interface)

As mentioned earlier in the README, I used Express to design and build the basic API. The type of API that is used in this project is called a **CRUD** API, or rather **C**reate **R**ead **U**pdate **D**elete, which is a common type of API that is sent over HTTP(S) _Hypertext Transfer Protocol (Secure)_.

Only two methods are used in this API; **POST** and **GET**, so it isn't _technically_ CRUD but it shares the same basic concepts.

I used `express.static()` middleware to host the local CSS and Javascript files that are used by the HTML, so they can always be accessed by `/<resource>[/<resource>,...]` and take priortity over all other endpoints.

I also made use of

```javascript
express.urlencoded({ extended: true })
```

so each express request was able to access an `x-www-form-urlencoded` request body, which is the format that is sent by the client webpage to the server's api.

To create two groups of endpoints, I made two separate files and used  `express.Router()` to make almost an express app inside an express app, and connected them all together using

```javascript
require('...');
```

and

```js
app.use('/midpoint', router);
```

#### Endpoints

##### /

> The homepage, rendered by Express and EJS view engine

##### /users

> **GET**: Return all users in JSON format
>
> **POST** Create a new user

##### /users/<user id>

> **GET** Return the user who shares the given ID in JSON format

##### /users/<user id>/balance

> **GET** Return the balance of the user in JSON format

##### /transactions

> **GET** Return all transaction history in JSON format
>
> **POST** Create a new transaction

##### /transactions/<transaction id>

> **GET** The transaction with ID in JSON format

#### Error Handling

Errors aren't handled the best that they can be. Currently if an error occurs with Sequelize, a HTTP status code `500` is sent, as well as the Sequelize error. In a real-world scenario, I would not want to return a sequelize error to the user, as this reveals sensitive information that may be exploited in the database.

On the note of revealing sensitive information, there is almost definetly the opportunity for [SQL Injection](https://en.wikipedia.org/wiki/SQL_injection), however due to the nature of the project and the time it would have taken to research how to mitigate it, I didn't look too far into patching it, however I *believe* that protection is build into the Sequelize project, however I could easily be wrong.

### Installing

To install, locally, you must have Node.Js installed. To install Node, go to [https://nodejs.org](https://nodejs.org).

Clone the folder, and open it inside your command prompt or terminal, and run the following commands:

```bash
npm install
npm run start
```

If you want to run remotely on a service like Repl.it, check out my project [here](https://school-project-bank.olivercordingle.repl.co)!