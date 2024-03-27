const Joi = require('joi')

const manageMaintenanceMode = {
    updateMaintenanceMode: {
        body: Joi.object()
            .required()
            .keys({
                isMaintenance: Joi.boolean().required(),
                description: Joi.string().when('isMaintenance', { is: true, then: Joi.required() })
            })
    }
}

const report = {
    countPropertiesCreatedByDate: {
        query: Joi.object().required().keys({
            fromDateRange: Joi.date().iso().required(),
            toDateRange: Joi.date().iso().required()
        })
    },

    countContactsByDate: {
        query: Joi.object().required().keys({
            fromDateRange: Joi.date().iso().required(),
            toDateRange: Joi.date().iso().required()
        })
    },

    getTotalAmountDepositedByDate: {
        query: Joi.object().required().keys({
            fromDateRange: Joi.date().iso().required(),
            toDateRange: Joi.date().iso().required()
        })
    },

    getTotalCreditsUsedByDate: {
        query: Joi.object().required().keys({
            fromDateRange: Joi.date().iso().required(),
            toDateRange: Joi.date().iso().required()
        })
    }
}

const manageService = {
    deleteService: {
        query: Joi.object().keys({
            serviceId: Joi.string()
                .pattern(/^\d+(,\d+)*$/)
                .message('serviceId must be a comma-separated list of numbers')
        })
    },
    updateService: {
        params: Joi.object().required().keys({
            serviceId: Joi.number().required()
        }),
        body: Joi.object()
            .required()
            .keys({
                serviceName: Joi.string(),
                duration: Joi.number().valid(15, 30, 60, 90, 120),
                price: Joi.number()
            })
    },
    createService: {
        body: Joi.object()
            .required()
            .keys({
                serviceName: Joi.string().required(),
                duration: Joi.number().required().valid(15, 30, 60, 90, 120),
                price: Joi.number().required()
            })
    }
}

const manageConversionRate = {
    deleteConversionRate: {
        params: Joi.object().required().keys({
            conversionRateId: Joi.number().required()
        })
    },

    updateConversionRate: {
        params: Joi.object().required().keys({
            conversionRateId: Joi.number().required()
        }),
        body: Joi.object()
            .required()
            .keys({
                newExchangeRate: Joi.number().greater(0).required()
            })
    },

    createConversionRate: {
        body: Joi.object()
            .required()
            .keys({
                currencyFrom: Joi.string().required().valid('USD').messages({
                    'any.only': 'Currency from must be USD'
                }),
                currencyTo: Joi.string().required().valid('Credit').messages({
                    'any.only': 'Currency to must be Credit'
                }),
                exchangeRate: Joi.number().greater(0).required()
            })
    }
}

const manageCategory = {
    deleteCategory: {
        params: Joi.object().required().keys({
            categoryId: Joi.number().required()
        })
    },

    updateCategory: {
        params: Joi.object().required().keys({
            categoryId: Joi.number().required()
        }),
        body: Joi.object().required().keys({
            categoryName: Joi.string().required()
        })
    },

    createCategory: {
        body: Joi.object().required().keys({
            categoryName: Joi.string().required()
        })
    }
}

const manageTransaction = {
    depositUserBalance: {
        params: Joi.object().required().keys({
            userId: Joi.number().required()
        }),
        body: Joi.object().required().keys({
            amountInDollars: Joi.number().required(),
            amountInCredits: Joi.number().required(),
            exchangeRate: Joi.number().required()
        })
    },

    getAllRentServiceTransactions: {
        query: Joi.object().keys({
            userId: Joi.number(),
            fromDateRange: Joi.date().iso(),
            toDateRange: Joi.date().iso(),
            page: Joi.number(),
            limit: Joi.number(),
            orderBy: Joi.string().valid('createdAt'),
            sortBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc')
        })
    },

    getAllDepositTransactions: {
        query: Joi.object().keys({
            userId: Joi.number(),
            fromDateRange: Joi.date().iso(),
            toDateRange: Joi.date().iso(),
            page: Joi.number(),
            limit: Joi.number(),
            orderBy: Joi.string().valid('createdAt'),
            sortBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc')
        })
    }
}

const manageProperty = {
    deleteListProperties: {
        query: Joi.object().keys({
            propertyId: Joi.string()
                .pattern(/^\d+(,\d+)*$/)
                .message('propertyId must be a comma-separated list of numbers')
        })
    },

    disableListProperties: {
        query: Joi.object().keys({
            propertyId: Joi.string()
                .pattern(/^\d+(,\d+)*$/)
                .message('propertyId must be a comma-separated list of numbers')
        })
    },

    getAllProperties: {
        query: Joi.object().keys({
            userId: Joi.number(),
            keyword: Joi.string(),
            featureId: Joi.string().pattern(/^\d+(,\d+)*$/),
            categoryId: Joi.string().pattern(/^\d+(,\d+)*$/),
            provinceCode: Joi.string(),
            districtCode: Joi.string(),
            wardCode: Joi.string(),
            priceFrom: Joi.number(),
            priceTo: Joi.number(),
            landAreaFrom: Joi.number(),
            landAreaTo: Joi.number(),
            areaOfUseFrom: Joi.number(),
            areaOfUseTo: Joi.number(),
            numberOfFloorFrom: Joi.number(),
            numberOfFloorTo: Joi.number(),
            numberOfBedRoomFrom: Joi.number(),
            numberOfBedRoomTo: Joi.number(),
            numberOfToiletFrom: Joi.number(),
            numberOfToiletTo: Joi.number(),
            page: Joi.number(),
            limit: Joi.number(),
            orderBy: Joi.string().valid('price', 'createdAt'),
            sortBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc')
        })
    },

    getProperty: {
        params: Joi.object().required().keys({
            propertyId: Joi.number().required()
        })
    }
}

const manageUser = {
    resetUserPassword: {
        params: Joi.object().required().keys({
            userId: Joi.number().required()
        })
    },

    updateUserById: {
        params: Joi.object().required().keys({
            userId: Joi.number().required()
        }),
        body: Joi.object().keys({
            roleId: Joi.number().valid(1, 2, 3).messages({
                'number.base': 'Role ID must be a number',
                'any.only': 'Role ID must be one of 1, 2, 3'
            }),
            fullName: Joi.string().messages({
                'string.base': 'Full name must be a string',
                'string.empty': 'Full name is required'
            }),
            phone: Joi.string()
                .regex(/^[0-9]{10}$/)
                .messages({
                    'string.base': 'Phone number must have 10 digits.'
                }),
            isEmailVerified: Joi.boolean(),
            avatar: Joi.string().messages({
                'string.base': 'Avatar must be a string'
            }),
            provinceCode: Joi.string(),
            districtCode: Joi.string(),
            wardCode: Joi.string(),
            street: Joi.string(),
            address: Joi.string()
        })
    },

    updateUserActiveStatus: {
        params: Joi.object().required().keys({
            userId: Joi.number().required()
        })
    },

    deleteListUsers: {
        query: Joi.object()
            .required()
            .keys({
                userId: Joi.string()
                    .pattern(/^\d+(,\d+)*$/)
                    .message('userId must be a comma-separated list of numbers')
            })
    },

    getUserById: {
        params: Joi.object().required().keys({
            userId: Joi.number().required()
        })
    },

    getAllUsers: {
        query: Joi.object().keys({
            roleId: Joi.number().valid(1, 2, 3).messages({
                'number.base': 'Role ID must be a number',
                'any.only': 'Role ID must be one of 1, 2, 3'
            }),
            email: Joi.string(),
            limit: Joi.number().integer().min(1).message('Limit must be a number and greater than 0').default(10),
            page: Joi.number().integer().min(1).message('Page must be a number and greater than 0').default(1),
            orderBy: Joi.string().valid('createdAt', 'email', 'fullName'),
            sortBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc')
        })
    }
}

module.exports = {
    manageMaintenanceMode,
    report,
    manageService,
    manageConversionRate,
    manageCategory,
    manageTransaction,
    manageProperty,
    manageUser
}
