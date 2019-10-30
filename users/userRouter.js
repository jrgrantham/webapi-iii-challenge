const express = require("express");

const Users = require("./userDb");
const router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body)
  Users.insert(req.body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error adding the user: ' + error.message,
      });
    })
});

router.post("/:id/posts", validateUserId, (req, res) => {});

router.get("/", (req, res) => {
  Users.get()
    .then(data => {
      res.status(200).json(data)
    })
    .catch(error => {
      res.status(500).json({ message: `Error getting Users: ${error.message}` })
    })
});

router.get("/:id", validateUserId, (req, res) => {
  res.json(req.data)
});

router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.data.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json({
        message: `There was an error fetching the posts to this User: ${error.message}`
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: `User ${req.params.id} has been nuked` });
    })
    .catch(error => {
      res.status(500).json({message: `Error removing the user ${req.params.id}: ${error.message}`})
    })
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  Users.update(req.params.id, req.body)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error updating the user: ' + error.message
      })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  Users.getById(id)
    .then(data => {
      if (data) {
        req.data = data;
        next();
      } else {
        res.status(404).json({ message: `User ${id} could not be found` });
      }
    })
    .catch(error => {
      res.status(400).json({ message: `Error message: ${error}` });
    });
}

function validateUser(req, res, next) {
  console.log(req.body)
  if (Object.keys(req.body).length) {
    if (req.body.name) {
      next()
    } else {
      res.status(400).json({ message: 'missing required name field' })
    }
  } else {
    res.status(400).json({ message: "missing user data" })
  }
}

function validatePost(req, res, next) {}

module.exports = router;
