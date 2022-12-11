import connection from "../server.js";

export async function findCustomers(req, res) {
    const { cpf } = req.query;
    
    try {
      if (cpf) {
        const filteredCustomers = await connection.query(
          `SELECT * FROM customers WHERE cpf Ilike '${cpf}%';`
        );
        return res.send(filteredCustomers.rows);
      }
  
      const customers = await connection.query(
        'SELECT * FROM customers;'
      );
      res.send(customers.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
}

export async function findCustomerById(req, res) {
    const { id } = req.params;

    try{
        const customer = await connection.query("SELECT * FROM customers WHERE id=$1", [id]);

        if(customer.rows.length === 0) {
            return res.sendStatus(404);
        }
        res.send(customer.rows);

    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function createCustomer(req, res) {
  const { name, phone, cpf, birthday } = res.locals.customer;

  try {
    await connection.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES($1, $2, $3, $4);",
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
