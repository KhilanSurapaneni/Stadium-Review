const Joi = require("joi");

// Create a JOI schema with custom error messages
module.exports.pitchSchema = Joi.object({
    pitch: Joi.object({
        title: Joi.string().required().messages({
            'string.base': 'Title should be a string.',
            'string.empty': 'Title is required.',
            'any.required': 'Title is a required field.'
        }),
        price: Joi.number().required().min(0).messages({
            'number.base': 'Price should be a number.',
            'number.min': 'Price should be at least 0.',
            'any.required': 'Price is a required field.'
        }),
        image: Joi.string().required().messages({
            'string.base': 'Image URL should be a string.',
            'string.empty': 'Image URL is required.',
            'any.required': 'Image URL is a required field.'
        }),
        description: Joi.string().required().messages({
            'string.base': 'Description should be a string.',
            'string.empty': 'Description is required.',
            'any.required': 'Description is a required field.'
        }),
        location: Joi.string().required().messages({
            'string.base': 'Location should be a string.',
            'string.empty': 'Location is required.',
            'any.required': 'Location is a required field.'
        })
    }).required().messages({
        'object.base': 'Pitch should be an object.',
        'any.required': 'Pitch is required.'
    })
}).required().messages({
    'object.base': 'Request payload should be an object.',
    'any.required': 'Request payload is required.'
});
