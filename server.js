import express from 'express';
import session from 'express-session';

const app = express();

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
}));

app.get('/api/login', async (req, res) => {
	res.status(200);
	return res.send();
});

app.use((err, req, res) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(process.env.PORT, () => console.log(`Example app listening at http://localhost:${process.env.PORT}`));
