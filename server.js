const express = require("express");
const path = require('path');
const cors = require("cors");
const cookieParser = require('cookie-parser');

const cookieSession = require("cookie-session");
const app = express();
const PORT = process.env.PORT || 8080;
require("dotenv").config();

const authConfig = require("./app/config/auth.config");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "auth-session",
    keys: [authConfig.secret],
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'Lax',
  })
);

const dbConfig = require("./app/config/db.config");
const db = require("./app/models");

const Role = db.role;

db.mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", (req, res) => {
    res.send("Bienvenidos a mi tienda");
});

app.use(cookieParser());

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/products.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/category.routes")(app);

app.use(express.static(path.join(__dirname, './app/view/build')));

// Ruta para manejar todas las solicitudes y redirigirlas al frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './app/view/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
        new Role({
          name: "moderator",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'moderator' to roles collection");
        });
  
        new Role({
          name: "admin",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }