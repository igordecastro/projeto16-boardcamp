import connection from "../server.js";

export async function findCategories(req, res) {
  try {
    const {rows} = await connection.query("SELECT * FROM categories;");
    res.send(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function createCategory(req, res) {
  const { name } = req.body;

  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1);", [
      name,
    ]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
