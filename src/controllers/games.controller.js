import connection from "../server.js";

export async function findGames(req, res) {
  try {
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.game;

  try {
    console.log(res.locals.game)
    await connection.query(
      'INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);',[
        name, image, stockTotal, categoryId, pricePerDay
      ]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
