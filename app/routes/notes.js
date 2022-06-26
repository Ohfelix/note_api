var express = require('express');
var router = express.Router();
const Note = require('../models/note.js')
const withAuth = require('../middlewares/auth')

router.post('/', withAuth, async (req, res) => {
    const { title, body } = req.body;
    var note = new Note({title: title, body: body, author: req.user._id});    
    try {
        await note.save();
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = router;