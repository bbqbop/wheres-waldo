const { Router } = require('express');
const router = Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

const gameController = require("../controllers/game")

router.get('/', gameController.readAll) 
router.post('/game', upload.single('image'), gameController.create)
router.put('/game/:id', gameController.update)

module.exports = router;
