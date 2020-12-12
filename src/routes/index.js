const { Router } = require("express");
const router = Router();
const admin = require("firebase-admin");
const config = require("../config.js");

var serviceAccount = require(config.firebase);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://node-firebase-9d788-default-rtdb.firebaseio.com/"
});

const db = admin.database();

router.get("/", async (req, res, next) => {
	db.ref("chars").once("value", (snapshot) => {
		const data = snapshot.val();
		res.render("index", {
			chars: data
		});
	});
});

router.post("/new-char", async (req, res, next) => {
	const newChar = {
		name: req.body.name,
		game: req.body.game
	};
	db.ref("chars").push(newChar);
	res.redirect("/");
});

router.get("/delete-contact/:id", async (req, res, next) => {
	db.ref("chars/" + req.params.id).remove();
	res.redirect("/");
})

module.exports = router;