import express from 'express';


const app = express()

app.use('/', (req, res, next) => {
    res.send('<h1>App</h1>');
})

app.listen(9000);