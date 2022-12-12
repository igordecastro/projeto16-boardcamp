import Joi from "joi";

export default async function validateRental(req, res, next) {
    //const {customerId,gameId,rentDate,daysRented,returnDate,originalPrice,delayFee} = req.body;

    const rentalSchema = Joi.object({
        customerId: Joi.number().integer().required(),
        gameId: Joi.number().integer().required(),
        daysRented: Joi.number().integer().min(1).required(),
    })

    const { error } = rentalSchema.validate(req.body, {abortEarly: false});

    if(error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).send(errors)
    }
    next();
}