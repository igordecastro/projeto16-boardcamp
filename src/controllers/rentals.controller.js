import connection from "../server.js";

let today = new Date();
let date = String(today.getDate()).padStart(2, "0");
let month = String(today.getMonth() + 1).padStart(2, "0");
let year = String(today.getFullYear());

today = date + "-" + month + "-" + year;

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const price = await connection.query(
            'SELECT "pricePerDay" FROM games WHERE id=$1;',
            [gameId]
        );

        const customerExists = await connection.query(
            "SELECT id FROM customers WHERE id=$1",
            [customerId]
        );
        const gameExists = await connection.query(
            "SELECT id FROM games WHERE id=$1",
            [gameId]
        );

        if (customerExists.rows.length === 0 || gameExists.rows.length === 0) {
            return res.sendStatus(400);
        }

        let originalPrice =
            Number(price.rows[0].pricePerDay) * Number(daysRented);

        await connection.query(
            'INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);',
            [customerId, gameId, today, daysRented, null, originalPrice, null]
        );
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function findRental(req, res) {
    let { customerId, gameId } = req.query;

    try {
        const customers = await connection.query("SELECT * FROM customers;");
        const games = await connection.query("SELECT * FROM games;");
        const rentals = await connection.query("SELECT * FROM rentals;");

        const rentalsResult = rentals.rows.map((rental) => ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.rentDate,
            daysRented: rental.daysRented,
            returnDate: null,
            originalPrice: rental.originalPrice,
            delayFee: null,
            customer: customers.rows.find(
                (customer) => customer.id === rental.customerId
            ),
            game: games.rows.find((game) => game.id === rental.gameId),
        }));

        if (customerId) {
            customerId = parseInt(customerId);
            const filteredByCustomer = rentalsResult.filter(
                (rental) => rental.customerId === customerId
            );

            return res.send(filteredByCustomer);
        } else if (gameId) {
            gameId = parseInt(gameId);
            const filteredByCustomer = rentalsResult.filter(
                (rental) => rental.gameId === gameId
            );
            return res.send(filteredByCustomer);
        } else {
            res.send(rentalsResult);
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.sendStatus(404);
    }

    try {
        const rentalAlredyFinished = await connection.query(
            "SELECT * FROM rentals WHERE id=$1;",
            [id]
        );

        if (rentalAlredyFinished.rows[0].returnDate !== null) {
            await connection.query("DELETE FROM rentals WHERE id=$1", [id]);
            return res.sendStatus(200);
        }

        res.sendStatus(400);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function finishRental(req, res) {
    const {id} = req.params;

    try {
        const rentalToBeFinished = await connection.query(
            "SELECT * FROM rentals WHERE id=$1",
            [id]
        );

        const day = rentalToBeFinished.rows[0].rentDate.getDate();

        date = Number(date);
        let delayFee = 0;

        if (date >= day) {
            const delayedDays = day - date;
            delayFee =
                (rentalToBeFinished.rows[0].originalPrice /
                    rentalToBeFinished.rows[0].daysRented) *
                delayedDays;
        }

        await connection.query(
            'UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;',
            [today, delayFee, id]
        );
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
