import connection from "../server.js";

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    let today = new Date();
    let d = String(today.getDate()).padStart(2, "0");
    let m = String(today.getMonth() + 1).padStart(2, "0");
    let y = today.getFullYear();

    today = m + "-" + d + "-" + y;

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
}
