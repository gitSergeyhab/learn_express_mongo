const fs = require('fs')
const express = require('express');
const tourRouter = require('./routes/tour-route');
const userRouter = require('./routes/user-route');
const {ApiRoute} = require('./const');






const port = 3000;
const app = express();

app.use(express.json())

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


app.use(ApiRoute.Tours, tourRouter);
app.use(ApiRoute.Users, userRouter);



app.listen(port, () => {
    console.log(`App listen port ${port}`)
});
