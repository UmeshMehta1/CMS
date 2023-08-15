const router = require('express').Router();
const path = require('path');

router.get("/", (req, res) => {
    const homeFilePath = path.resolve(__dirname + "/../FrontEnd/index.html")
    res.sendFile(homeFilePath);
})

module.exports = router;