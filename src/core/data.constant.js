const COMMON_EXCLUDE_ATTRIBUTES = {
    USER: ['password', 'emailVerificationCode']
}

const PAGINATION_DEFAULT = {
    USER: {
        LIMIT: 10,
        PAGE: 1,
        ORDER_BY: 'createdAt',
        SORT_BY: 'desc'
    },
    PROPERTY: {
        LIMIT: 10,
        PAGE: 1,
        ORDER_BY: 'createdAt',
        SORT_BY: 'desc'
    }
}

module.exports = {
    COMMON_EXCLUDE_ATTRIBUTES,
    PAGINATION_DEFAULT
}
