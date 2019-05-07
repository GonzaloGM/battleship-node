Battleship - Node.js Exercise 
============

Battleship game exercise made in Node.js. Rules and specifications at the end.

Assumptions and Clarifications
------------
  * Instructions weren't clear about what's considered a turn, so for this case, I assumed that a turn is
only lost if the player misses. If the player hits a boat, he won't lose that turn.
  * User CRUD must be done by a user who has the `isAdmin` property in their user document set to `true`. This
  has to be done manually in the DB for now, but in a real application this would be handled differently
  (adding a permissions system and adding an admin as the first user created).
  * Error messages are intentionally left ambiguous in order to expose the least amount of information from the system
  * Some solutions were simplified in order to decrease development time due to the time constraint. In other conditions
  they would've been implemented more flexible and robustly (like sort and filtering)

TODO
------------
Things left to do later (they weren't finished due to the time constraint):

  * More tests
  ^ Request JSON validation with joi
  * Finish API documentation (Swagger)
  * Pino logger
  * express-limit-rate
  * express-slow-down
  * express-brute
  * overload-protection
  * safe-regex
  * Kraken

API Documentation
------------
The API is documented with Open API 3.0 (previously Swagger). In order to access it, we have to open the following
URL in the browser: http://localhost:3000/api-docs/ or access `/api-docs/` if hosted somewhere else.

Technology notes
------------

 1. **Database**: MongoDB was the selected database for easier setup (vs Deepstream) and due to the exercise constraints.
 If the exercise grew in complexity, adding more related entities, I would have considered a SQL database like
 PostgreSQL. 
 2. **Auth**: In order to register we have to hit the `/v1/users` endpoint with a `POST` request like the docs indicate. 
 After that, we'll get a `token` property which has to be sent as a Bearer Token Authorization header for the next requests.
 3. **SSL**: SSL hasn't been set in the codebase because the code is deployed to Heroku, which adds SSL. Otherwise it 
 would've been added.
 4. **.env file**: an .env file has been committed to set environment variables. This has been done for this
 exercise only and in normal conditions this wouldn't be committed to the repository.

Original specifications for the exercise
------------
In this project, you will build a version of the classic board game Battleship! There won’t be
front-end so it will be played by hitting REST endpoints. A bit sad for the person responsible for
reviewing and testing the application.
There will be 10 ships hidden in random locations on a square grid. The player will try to sink all
the ships randomly positioned by the game in a given amount of turns.
 
Design constraints
 
The board should be a 10x10 grid.
The ships should be randomly positioned throughout the board, vertically and horizontally,
making sure that none of them overlap.
 
Ships:
  *  1 that is 4 spaces long.
  *  2 that are 3 spaces long.
  *  3 that are 2 spaces long.
  *  4 that are 1 space long.
 
There are 2 ways to end the game:
  *  The player sinks all the ships from the board winning the game.
  *  The player surrenders, losing the game immediately.
  *  The player run out of turns losing the game.
 
The game must be initiated by providing a “name” and the “difficulty”. If the user authentication is build (optional) the userId will be also another param to consider.
 
The amount of turns given per difficulty type will be decided by the developer.
 
The following events are expected to be supported in order to play the game
 
1. Related to the Game, apart from playing battleship, it should be possible to:
a. Delete an existing game
b. Surrender a game
c. Filter games by status (“active”, “finished”) and/or result (“won”, “lost”, “surrender”).
d. Sort games by “status”, “results”, “start date”, etc.
 
2. Get a history of played games with statistics on the accuracy, start date, end date, status
(win/lose/surrender) and turns used.
3. (Optional) CRUD User.
Considered a plus
4. (Optional) Authentication and protect the endpoints for unauthorized access.
Considered a plus
.a.The requests to fetch games (with or without filters/sorts) should get only the games from the current logged user.
 
Technical constraints (Back-end)
 
1. The backend must be made with Node.js and the language could be just Javascript or Typescript (plus)
2. The API endpoints should have validations, if any, and accordingly return the appropriate error if necessary. For instance, a request to
hitCell (POST) with payload {x = 1and y = 15, gameId: 100} should throw an error given that the cell position is out of the board boundaries.
a. Some edge cases will be tested on all the endpoints exposed to check
consistency. I.E, sending nulls, wrong data, etc.
3. The data persistence can be made using Deepstream or any database that you consider
appropriate (Mongo, SQL, etc...)
4. Bonus features:
a. Test the backend
