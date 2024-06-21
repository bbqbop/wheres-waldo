const { Router } = require('express');
const router = Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

const gameController = require("../controllers/game");
const userController = require("../controllers/user");

const { authJwt, authAdmin } = require("../utils/auth")

router.get('/games', gameController.readAll) 
router.post('/games', authJwt,upload.single('image'), gameController.create)
router.get("/game/:id", gameController.read)
router.put('/game/:id', gameController.update)
router.put('/game/:id/scores', gameController.updateScores)
router.delete('/game/:id', authJwt, gameController.delete)

router.post('/user/sign-up', userController.signUp)
router.post('/user/login', userController.login)

module.exports = router;
