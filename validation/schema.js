const Joi = require("joi");


module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        "image.url": Joi.allow("", null),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required()
});