import connection from "../server.js";

export async function findGames(req, res) {
  const { name } = req.query;

  try {
    if (name) {
      const filteredGames = await connection.query(
        `SELECT games.*, categories.name AS "categoryName" FROM categories JOIN games ON games."categoryId"= categories.id WHERE games.name Ilike '${name}%';`
      );
      return res.send(filteredGames.rows);
    }

    const games = await connection.query(
      'SELECT games.*, categories.name AS "categoryName" FROM categories JOIN games ON games."categoryId"= categories.id'
    );
    res.send(games.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.game;

  try {
    await connection.query(
      'INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);',
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
