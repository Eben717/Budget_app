import express from 'express';

const app = express();


app.get('/', (req, res) => {
    res.send ('Budget App is Working!!');
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
}
);