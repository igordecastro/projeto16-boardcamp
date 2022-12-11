import Joi from "joi";
import connection from "../server.js";

export default async function validateGame(req, res, next) {
  const gameSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    stockTotal: Joi.number().integer().min(1).required(),
    categoryId: Joi.number().integer().required(),
    pricePerDay: Joi.number().integer().min(1).required(),
  });

  const { error } = gameSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }
  try {
    const gameAlreadyExists = await connection.query(
      `SELECT name FROM games WHERE name='${req.body.name}';`
    );

    if (gameAlreadyExists.rows.length !== 0) {
      return res.status(409).send({ message: "Jogo já existente" });
    }

    res.locals.game = req.body;
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
