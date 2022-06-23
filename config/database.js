const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/note_api', 
  { useNewUrlParser: true ,
    useUnifiedTopology: true ,     
  }).then(() => { 
    console.log('Connected to sucessfully');
    }).catch(err => console.log(err));