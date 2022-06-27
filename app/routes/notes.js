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

router.get('/:id', withAuth, async(req, res) => {
    try {
        const { id } = req.params;
        let note = await Note.findById(id);
        if(isOwner(req.user, note))
            res.json(note);
        else
            res.status(401).json({error: 'Permision denied'})
    } catch (error) {
        res.status(500).json({error: 'Problem to get a note'})
    }
})

router.get('/search', withAuth, async(req, res) => {
    const { query } = req.query;
    try {
        let notes = await Note
        .find({ author: req.user._id })
        .find({ $text: {$search: query }})
    res.json(notes)
    } catch (error){
        res.json({error}).status(500);
    }
});


router.get('/', withAuth, async(req, res) => {
    try {
        let notes = await Note.find({author: req.user_id});
        res.send(notes);
    } catch (error) {
        res.json({error: error}).status(500)
    }
})

router.put('/:id', withAuth, async(req, res) => {
    const { title, body } = req.body;
    const { id } = req.params;
    try {
        var note = await Note.findOneAndUpdate(
            {_id: id},
            { $set: { title: title, body: body}},
            { upsert: true, 'new': true }
        )
        res.json(note);               
    } catch (error) {
        res.status(500).json(error);
    }
});

const isOwner = (user, note) => {
    if(JSON.stringify(user._id) == JSON.stringify(note.author._id))
        return true;
    else
        return false;
}

router.delete('/:id', withAuth, async(req, res) => {
    const { id } = req.params;
    try {
        let note = await Note.findById(id);
        if(isOwner(req.user, note)){
            await note.delete();
            res.json({message:'Ok'}).status(204)
        } else 
            res.status(403).json({error: 'Permission denied'});
    } catch (error) {
        res.status(500).json({error: 'Problem to delete a note'});
    }
});
module.exports = router;