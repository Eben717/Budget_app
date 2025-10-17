import express from "express";

const app = express();


app.get("/", (req, res) => {
    res.send("Hello I am the backend");
});

app.listen(5001, () => {
    console.log("Server is running on port 3000");
});