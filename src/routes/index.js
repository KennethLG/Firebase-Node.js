const { Router } = require("express");
const router = Router();
const admin = require("firebase-admin");
const config = require("../config.js");

var serviceAccount = require(config.firebase);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://node-firebase-9d788-default-rtdb.firebaseio.com/"
});

const db = admin.firestore();

router.get("/", async (req, res, next) => {
	try {
		const query = db.collection("chars");
		const querySnapshot = await query.get();
		const data = querySnapshot.docs.map(doc => ({
			id: doc.id,
			name: doc.data().name,
			game: doc.data().game
		}));

		res.render("index", {
			chars: data
		});
	} catch(e) {
		console.error(e);
		next(e);
	}
});

router.post("/new-char", async (req, res, next) => {
	try {
		const newChar = {
			name: req.body.name,
			game: req.body.game
		};
		await db.collection("chars").doc().create(newChar);
		res.redirect("/");
	} catch(e) {
		console.error(e);
		next(e);
	}
});

router.get("/delete-char/:id", async (req, res, next) => {
	try {
		const data = db.collection("chars").doc(req.params.id);
		await data.delete();
		res.redirect("/");
	} catch(e) {
		console.error(e);
		next(e);
	}
})

module.exports = router;