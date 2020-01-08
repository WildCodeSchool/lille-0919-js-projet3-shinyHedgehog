const express = require("express");
const { connection } = require("../conf");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../passport-strategies");
const { jwtSecret, saltRounds } = require("../conf");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  const formData = req.body;
  bcrypt.hash(req.body.password, parseInt(saltRounds), (err, hash) => {
    formData.password = hash;
    connection.query(
      `
      INSERT INTO USER 
      SET ?
      `,
      formData,
      (err, results) => {
        if (err) {
          // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
          console.error("Failure! " + err);
          return res.status(400).send("Invalid User creation request");
        } else {
          // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
          res.status(201).json(formData);
        }
      }
    );
  });
});

router.post("/login", (req, res) => {
  passport.authenticate(
    "local",
    { session: false },
    (errAuth, user, infoAuth) => {
      if (errAuth)
        return res.status(500).json({
          tldr: "Tech error!",
          details: errAuth,
          message: infoAuth
        });

      if (!user)
        return res.status(401).json({
          tldr: "Form error!",
          details: "Either mail or password is incorrect",
          message: infoAuth
        });

      const token = jwt.sign(user, jwtSecret);
      return res.status(200).json({ user, token });
    }
  )(req, res);
});
router.get(
  "/testAuth",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).send(`Welcome ${req.user.pseudo}, you're logged in !`);
  }
);

module.exports = router;
