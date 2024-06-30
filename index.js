const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = express();

var serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});


const db = getFirestore();
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/signup', function (req, res) {
    res.render('Signup');
});

app.post('/signupSubmit', function (req, res) {
    const full_name = req.body.full_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    db.collection("users")
    .add({
        name: full_name + ' ' + last_name,
        email: email,
        password: password
    }).then(() => {
        res.render('dashboard');
    });
});

app.get("/login", function (req, res) {
    res.render('Login');
});

app.post("/loginsubmit", async function (req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userQuery = await db.collection("users")
            .where("email", "==", email)
            .where("password", "==", password)
            .get();

        if (userQuery.size > 0) {
            let usersData = [];
            const allUsers = await db.collection('users').get();
            allUsers.forEach(doc => {
                usersData.push(doc.data());
            });
            return res.render("dashboard", { usersData });
        } else {
            return res.send("Invalid Credentials");
        }
    } catch (error) {
        console.error("Error signing in: ", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(9000, () => {
    console.log("Server is running on port 9000");
});