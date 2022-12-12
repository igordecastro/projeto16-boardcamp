import Joi from "joi";
import connection from "../server.js";

export default async function validateCustomer(req, res, next) {
  const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().min(10).max(11).required(),
    cpf: Joi.string().regex(/^\d+$/).length(11),
    birthday: Joi.date().required(),
  });

  const { error } = customerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  try{
    const customerAlreadyExists = await connection.query(
        `SELECT cpf FROM customers WHERE cpf='${req.body.cpf}';`
      );
  
      if (customerAlreadyExists.rows.length !== 0) {
        return res.status(409).send({ message: "Cliente já existente" });
      }
  
    res.locals.customer = req.body;
    next();
  } catch(err) {
    res.status(500).send(err.message)
  }
}
