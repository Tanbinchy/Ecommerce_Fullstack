_|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||_
_|||||||||||||||||||||||||||||||| E-COMMERCE MERN STACK PROJECT ||||||||||||||||||||||||||||||_
_|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||_

## Frontend + Deployment Quick Start

- Client dev: `cd client && npm install && npm run dev`
- API dev: `cd server && npm install && npm run dev`
- Client env: copy `client/.env.example` to `client/.env` and set `VITE_API_URL=http://localhost:3001/api`
- API env: copy `server/.env.example` to `server/.env` and fill MongoDB, JWT, SMTP, and Cloudinary values
- Vercel: deploy the `client` folder, set `VITE_API_URL=https://your-render-service.onrender.com/api`
- Render: deploy the `server` folder or use `render.yaml`, then set `CLIENT_SITE_URL=https://your-vercel-app.vercel.app`
- Local demo seed: `cd server && npm run seed:demo`
- Seed API, if you set `SEED_SECRET`: `http://localhost:3001/api/seed/demo?key=YOUR_SEED_SECRET`
- Production demo seed: `https://your-render-service.onrender.com/api/seed/demo?key=YOUR_SEED_SECRET`
- Admin login route: `/admin/login`

_||||||||||||||||||||||||||||||||||||||| BACK END NOTE |||||||||||||||||||||||||||||||||||||||_
_|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||_

0.  JUST GOOD TO KNOW
    - Flow :- server.js --> app.js --> routers --> controllers --> models
    - Normal function parameters - req, res
    - Middleware function parameters - req, res, next
    - Schema is a kind of validation to validate data before storing in database (Execute in the controllers)
    - Use express-validator to validate user input before even storing in database (Execute before going to controllers)
    - Always handle input validation on user input
1.  Environment setup
    - Create a folder
2.  Express server setup
    - npm init -y (For using 3rd party packages like Express JS)
    - npm i express
    - Create express server in server.js file
    - Have to set "main":"server.js" in package.json
3.  HTTP request & response
    # Request:- Client To Server
    - Methods - GET, POST, PUT, DELETE
    - HTTP Headers - Content type, Cookies
    - Content Body - Data
    # Response:- Server To Client
    - Status Code - 200, 404, 500, 400
    - HTTP Headers - Cookies **(Not necessary most of the time)**
    - Response Body - Json format data
4.  Nodemon and Morgan and Parser
    - npm i --save-dev nodemon (Auto refresh the request)
    - Have to modify in package.json `"scripts": {"dev": "nodemon ./src/server.js"}`
    - To execute run npm dev run in terminal
    - npm i --save-dev morgan (Extract request information) - I didn't use it
    - npm i cookie-parser - For extract information from json body
5.  Middleware
    - Document link - https://expressjs.com/en/guide/using-middleware.html
    - Application-level – Used for global tasks like logging with `app.use()`
    - Router-level – Used for specific routes with `router.use()`
    - Error-handling – Handles errors using `(err, req, res, next)`
    - Built-in – Provided by Express, like `express.json()` or `express.static()`
    - Third-party – Extra features via packages like `morgan`, `cors`, `helmet`
6.  Create and Handle HTTP errors
    - npm i http-errors
    - Parameters (Status Code, Error Message)
7.  Secure API
    - npm i express-xss-sanitizer (Sanitize user input from post body)
    - npm i express-rate-limit (Limiting the api request)
8.  Environment variable & .gitignore
    - npm i dotenv - Secret variables
    - .gitignore File - Just copy paste shortcut :- https://github.com/github/gitignore/blob/main/Node.gitignore
9.  MVC architecture
    - Model (Work with data like schema)
    - View (Work with frontend)
    - Controller (Control api request)
    # MVC is a folder structure
    - Models folder (Work with `data`)
    - Routers folder (Define the routes or `api's`)
    - Controllers folder (Work with `logical part` of api's or functions)
10. MongoDB connection
    - Config folder (Connection)
    - npm i mongoose (MongoDB package)
    # A database has collections and each collection has data
    # A schema defines the shape of that data and a model lets you use it in your code
    └── Database
    └── Collection (e.g., Users)
    └── Document (e.g., { name: "Alice", age: 25 })
    └── Schema (defines: name = String, age = Number)
    └── Model (used in code to interact with documents)
11. Create schema and model
    - npm i validator (Email pattern is right or not)
    - npm i bcryptjs (Encrypt and decrypt a password)
12. Create seed-route for testing
    - Add all the data from `initialData.js` into DB
13. Get or search users from DB with Searching and Pagination
    # Controller :- Fetch query from req.query
    a. search → keyword
    b. page → page number
    c. limit → users per page
    . Set default values if empty
    . Call serviceGetUsers(search, page, limit)
    . Receive { users, count, pagination } from service
    . Return success response using successResponse()
    . If error → next(error)
    # Service :- Create and return for controller
    a. Create search regex - Partial match + case insensitive
    b. Create filter - Search by name, email, phone
    c. Define options - Hide password, createdAt, updatedAt, v
    d. Fetch users
    . limit(limit) → users per page
    . skip((page - 1) x limit) → pagination
    e. Count total users
    . countDocuments(filter)
    . If no user found → throw 404 error
    f. Create pagination object - totalPages, currentPage, previousPage, nextPage
    g. Return - users, count
14. Response Helper
    - For handling error and success response in `responseHelper.js`
15. Get a single user by id
    - GET api/users/:id (`:anyVariable` means dynamic)
16. Create services in the backend for reusing
    - Move all the find related statements in `src\services\findEntity.js`
    - Created a template for finding anything
    - I have named `entity` for user, item, product etc.
17. Delete a single user by id
    - Firstly, have to find the user with `src\services\findEntity.js`
    - Secondly, have to remove the image using `fs` module in `src\controllers\userController.js`
    - Finally, we can delete the user with `findByIdAndDelete`
    - DELETE api/users/:id (`:anyVariable` means dynamic)
18. Refactoring, reusability & dynamic
    - If confuse watch this :- https://youtu.be/4iXq0_5nRVM?si=bhQXEPXLUdlkxMEu
19. Delete image in helper folder
    - Use services folder when working with database
    - Otherwise use helper folder
    - So, we move the delete image code to the `src\helpers\deleteImgHelper.js`
20. Create an user
    # PART 1
    _/api/users/register_
    - Fetch data from `req.body`
    - Check if user exit or not
    - npm i jsonwebtoken (Install JWT package)
    - Create a `JWT token` and store data in token (Temporarily)
    - `SMTP` server set up for sending mail using `google app password` (Link :- https://security.google.com/settings/security/apppasswords)
    - Send `JWT token` through user `email` using `nodemailer package` (npm i nodemailer)
    - Sending an email with ethereal code template link :- https://nodemailer.com/
    # PART 2
    _/api/users/verify_
    - Fetch `JWT token` from `req.body`
    - Verify `JWT token`
    - Fetch data from `JWT token`
    - Store the user
21. Register image
    - npm i multer (Work with files)
    - Use `multer.diskStorage` as storage for string type image
    - Disk storage template code link :- https://www.npmjs.com/package/multer
    - File size and type filtering
    - Using `src\config\index.js` to define image variables (e.g., MAX_FILE_SIZE)
22. Input validation for user registration
    - npm i express-validator
    - Create validators in `src\validators\authValidator.js`
    - Run validators in `src\validators\index.js`
23. Store image as "Buffer"
    - In `src\middlewares\uploadFileMiddleware.js`
    - Use `multer.memoryStorage` as storage for buffer type image
    - Save image as bufferString using `base64`
    - But for now we are using string not buffer string
24. Update user by ID
    - Get user ID from `req.params`
    - Check, if the user is exist or not
    - Define which fields are allowed to update
    - Loop through request body and copy only allowed fields
    - Throw error if trying to update email
    - If image is uploaded - Check if size is within 2MB and Save image path
    - Delete old image if it's not the default
    - Update the user in the database with new data
25. User login
    # PART 1 - Authentication (Process of verifying a user's identity, ensuring they are who they claim to be)
    - Fetch user email and password from `req.body`
    - Check, if the user is exist or not
    - Compare the password
    - Check, if the user is banned or not
    - Create a token and store it in `http cookie`
    - npm i cookie-parser (To fetch data from cookie)
    # PART 2 - Authorization (It determines what actions a user is allowed to perform and what resources they can access)
    - Will add future
26. User logout
    - Just clear the cookie by `res.clearCookie("cookieName")`
27. User middlewares :- "authMiddleware.js"
    # IsLoggedIn middleware
    - Check if accessToken exists in cookies by `req.cookies.cookieName`
    - Verify accessToken by `jwt.verify(accessTokenName, jwtAccessKey)`
    - Attach decodedAccessTokenUser to `req.user`
    # IsLoggedOut middleware
    - Check if accessToken exists in cookies by `req.cookies.cookieName`
    - If exists, block access
    - Else, go to next middleware
    # IsAdmin middleware
    - Check if `req.user.isAdmin` is true
    - If not, block access
    - Else, go to next middleware
28. Input validation for user login
    - File "authValidator.js"
    - Validators will execute before going to controllers
    - We create 5 user input validation :- `userRegistrationValidation`, `userLoginValidation`,
      `userPasswordUpdateValidation`, `forgetPasswordValidation`, `resetPasswordValidation`
29. Ban and Unban controller
    - If action = 'ban' then isBanned: true
    - If action = 'unban' then isBanned: false
30. Making services for user controller
    - File name `src\services\userService.js`
    - For all the user controller we make the services
    - All the database related works will handle in the services
    - Only the response will be execute is controllers
31. User DB logic
    - In `src\services\userService.js` To keep controllers clean
32. Handle mongoose cast error
    - Used in `src\services\userService.js` where mongoose id works are available
33. Update user password
    - Take user email, old password, new password and confirmed password
    - Extract user email, old password, new password and confirmed password
    - Check `isUserExist` and `isPasswordMatched`
    - Set up update options
    - Give response
34. Forget and reset password
    # PART 1
    _api/users/forget-password_
    - Fetch user email from req.body
    - Check isUserExist or not
    - Create a JWT Token - Can copy from register
    - Send a reset password link by email with JWT Token
    # PART 2
    _api/users/reset-password_
    - Fetch JWT Token and password from req.body
    - Verify JWT Token and save in decoded
    - If decoded is empty show error message
    - Else execute findOneAndUpdate and save in updatedUser
    - If updatedUser is not successful show an error message
    - Else reset password and show an success response
35. Generate refreshToken
    - While user login we create accessToken (15m) and refreshToken (7days)
    - When `accessToken` is expired - We can generate new accessToken if the `refreshToken` is valid
    - Again verify the accessToken and if valid than return the response
36. Create protectedRoute
    - If the accessToken is verified
    - Then the user will get access the requested route
37. Refactoring controllers and routes
    A. Clean refreshToken also when logout user
    B. For testing the accessToken we have to set the `secure: false` while generating Tokens
    C. File :- In `src\controllers\authController.js` & Function :- In `handleLogin()`
    FROM :- const withoutPassword = await User.findOne({ email }).select("-password");
    TO :- const withoutPassword = user.toObject(); delete withoutPassword.password;
    D. Naming controllers function with handle (Exp:-`handleGetUsers`)
    E. File :- In `src\services\userService.js` & Function :- In `serviceGetUsers()`
    FROM :- if (!users) throw createError(404, "No user found...!");
    TO :- if (!users || users.length === 0) throw createError(404, "No user found!");
38. Modularity
    - Separate in a new file `await User.exists({ email: newUser.email })` - But for now I did not
    - Separate the sending email code in a new file `sendEmailHelper.js`
39. npm i winston
    - For saving console log and error in `logs` folder
    - Pure unnecessary package...So I have created but did not use
    - Just the replacement of console.log
40. Category model and input validation
    - Category model is for saving the required fields in the DB
    - Input validation is for validating user input before even saving in the DB
41. Get category by slug
    - Returning all the categories in the database
    - And also I handle the single one by slug
42. Create category
    - Create a `categoryRouter`
    - Adding slug to category name with `npm i slugify`
    - Example: Smart-phone (Here `phone` is a slug)
43. Get category by slug
    - Get a single category by slug
44. Update category
    - Matching the category by `Slug`
    - Replace it with `name`
    - Direct update with $set
45. Delete category
    - Delete the category by `slug`
46. Get or search categories from DB with Searching and Pagination
    # Controller :- Fetch query from req.query
    a. search → keyword
    b. page → page number
    c. limit → categories per page
    . Set default values if empty
    . Call serviceGetCategories(search, page, limit)
    . Receive { categories, count, pagination } from service
    . Return success response using successResponse()
    . If error → next(error)
    # Service :- Create and return for controller
    a. Create search regex - Partial match + case insensitive
    b. Create filter - Search by name
    c. Fetch categories
    . limit(limit) → categories per page
    . skip((page - 1) x limit) → pagination
    d. Count total categories
    . countDocuments(filter)
    . If no user found → throw 404 error
    e. Create pagination object - totalPages, currentPage, previousPage, nextPage
    f. Return - categories, count
47. Product model and Seeding products
    - Category field in the productModel – reference to Category model using ObjectId
48. Get product by slug
    - Get a single product by slug
49. Create product
    - Fetch all the fields value from req.body
    - With productValidation we validate the user input
    - Check the image size and is the product already exists
    - Handle uploadProductImage in `src\middlewares\uploadFileMiddleware.js`
    - If everything fine than store the data in the newProduct
    - Then we create the product and give a success response
50. Delete product by slug
    - Must delete the product image also
51. Update product by slug
    # Updating Needs 3 Parameters:
    - Filter: What basis or how to find the document (e.g., by slug)
    - Update Fields: What data is allowed to change (e.g., by $set)
    - Options: Extra behavior (e.g.,
      new: true --> Returns the updated document
      runValidators: true --> Applies mongoDB schema validation on update
      context: "query" --> Required for proper validation check)
    # Step By Step
    - Fetch product using slug and if not exist throw an error
    - It helps to delete old image later if image updated
    - Update the requested fields if allowed
    - If the requested field is `name` than we have to update the `slug` too
    - And if the requested field is `image` than we will delete the old image and set the new one
    - But we won't delete if the old image is the default image
    - Finally if everything goes right we will save the update and return an success response
52. Get or search products from DB with Searching and Pagination
    # Controller :- Fetch query from req.query
    a. search → keyword
    b. page → page number
    c. limit → products per page
    . Set default values if empty
    . Call serviceGetProducts(search, page, limit)
    . Receive { products, count, pagination } from service
    . Return success response using successResponse()
    . If error → next(error)
    # Service :- Create and return for controller
    a. Create search regex - Partial match + case insensitive
    b. Create filter - Search by name
    c. Define options - Hide password, createdAt, updatedAt, v
    d. Fetch products
    . limit(limit) → products per page
    . skip((page - 1) x limit) → pagination
    e. Count total products
    . countDocuments(filter)
    . If no user found → throw 404 error
    f. Create pagination object - totalPages, currentPage, previousPage, nextPage
    g. Return - products, count
53. Uploading files (users and products) in Cloudinary
    - npm i cloudinary
    - Cloudinary config file `src\config\cloudinary.js`
    - Removing destination function from upload file middleware
    - Updating the serviceVerifyUser middleware for uploading files
54. Deleting files (users and products) from Cloudinary
    - Extract publicID from the userImage path uploaded in Cloudinary `src\helpers\cloudinaryHelper.js`
    - Remove `await deleteImage(user.image)` line of code from serviceDeleteUserById middleware
    - Finally delete the file from Cloudinary using `cloudinary.uploader.destroy()`
55. Updating files (users and products) in Cloudinary
    - If image found then first extract the public id by `extractPublicIdFromCloudinary`
    - Then using the publicId update the image and destroy the old one

_|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||_
_||||||||||||||||||||||||||||||||||||||| FRONT END NOTE ||||||||||||||||||||||||||||||||||||||_
_|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||_

0. JUST GOOD TO KNOW
   - There is only one page in react `index.html` - Thats why react called single page application
   - `Main.jsx` is connected with the `index.html` and will render the `App.jsx` component
   - Naming of component will be in capital format like `App.jsx`
1. Create react app using vite
   - npm create vite@latest - Set up react app using JS
   - npm install - Install npm dependencies
   - npm run dev - To run the client site
2. Routing setup
   - npm i react-router-dom
   - Main.jsx will load the App.jsx
   - App.jsx will load Index.jsx
   - Index.jsx will load pages
3. Page title setup
   - npm i react-helmet
   - Create and load the `PageTitle.jsx` from all the pages
4. Navigation setup
   - In `Navbar.jsx` using nav and NavLink from `react-router-dom`
   - Load `Navbar.jsx` before the Routes in the `index.jsx`
   # Navbar css
   - npm i tailwindcss @tailwindcss/vite
   - Add this codes in `vite.config.js` if not automatically updated :-
     import { defineConfig } from "vite";
     import react from "@vitejs/plugin-react";
     import tailwindcss from "@tailwindcss/vite";
     export default defineConfig({ plugins: [react(), tailwindcss()]});
   - In `index.css` add :- @import "tailwindcss";
   - In `main.jsx` add :- import "./index.css"
   - Now we can use TailwindCSS className
5. Footer setup
   - In `Footer.jsx` using footer tag
   - Load `Footer.jsx` after the Routes in the `index.jsx`
6. Sidebar setup
   - In `Sidebar.jsx`
   - Load in `Home.jsx` only
7. Redux Toolkit setup
   - Redux is made to simplify the creation of a redux store and provide easy state management
   - npm i @reduxjs/toolkit - For using Toolkit
   - npm i react-redux - Used for react app
   # First To Create Slices
   - Create `counterSlice.js` using `createSlice` method from `@reduxjs/toolkit`
   - Slice have 3 fields :-
     name : Slice name
     initialState : Staring value
     reducers: Logical part
   - Data flow :-
     1 --> Reducer (Handle data changing logic from react app)
     2 --> Store (Keep the updated value from reducer)
     3 --> React app (Use the updated value and also can update value from store using reducer)
   # Second To Create Store and Connect The Slices With The store
   - Create `store.js` using `configureStore` method from `@reduxjs/toolkit`
   # Third To Provide The Store In The Main App
   - In `main.jsx` use `Provider` from `react-redux` and store attribute to connect with store
   - Done...Now we can use the store from anywhere in the app
8. Axios setup
   . Promise-based HTTP client library used to make requests to external APIs from the browser
   . npm i axios

_|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||_
_||||||||||||||||||||||||||||||||||||||| MY EXTRA NOTE |||||||||||||||||||||||||||||||||||||||_
_|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||_

1. How the error work in app.js file...?
   - Express uses middleware functions and it has a special kind of middleware — error-handling middleware, which has four arguments: `(err, req, res, next)`
   # Client-error handler(404)
   - This runs if none of the defined routes matched
   - It creates a `404` error using `http-errors` and passes it to the next middleware
   - `next(createError(...))` moves the error into the error-handling middleware below
   - Example:
   - User hits `/api/unknown`.
   - Express checks all routes (`/api/users`, `/api/seed`) — none match.
   - This middleware is triggered and creates a 404.
   - The error goes to the universal handler next.
   # Server-error handler / Universal handler
   - This catches any error that was passed using `next(error)` from anywhere in your app. It could be:
   - A `404` like above
   - A database error
   - A coding bug (`throw new Error(...)`)
   - A manually created error inside route handlers or middleware
   # Example flow - Let’s say the user hits `/api/wrong`
   1. Express tries all routes. None match
   2. `Client-error middleware` is triggered
   3. `createError()` makes a `404` error object and passes it via `next(...)`
   4. The error is now caught by `Server-error middleware`
   5. You log the error and send a clean JSON response using `errorResponse()`
2. Why do Category, User and Product APIs follow different update approaches...?
   - We use two different update styles because the number of fields and security level are different. In the Category API, there are only one or two fields and all of them are allowed to be updated, so we can directly set the new values without any permission check. But in the User and Product APIs, there are many fields and not every field is allowed to be updated and users usually update only a few fields at a time. So we must track which fields are requested, allow updates only for permitted fields and block restricted ones to prevent unauthorized or accidental changes and to keep the database secure and flexible.
3. What is React and why is react...?
   - React is a JavaScript library for building user interfaces
   - Component-based architecture using JSX
   - Single Page Application model as `index.html`
   - Uses virtual DOM for performance optimization
