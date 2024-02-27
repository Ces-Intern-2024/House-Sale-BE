const SUCCESS_MESSAGES = {
    REGISTER: {
        USER: 'Registration success for new user!',
        SELLER: 'Registration success for new seller! Please check your email to verify your account!'
    },
    LOGIN: 'Login success!',
    LOGOUT: 'Logout success!',
    REFRESH_TOKENS: 'Refresh tokens successfully!',
    ADMIN: {
        GET_USER: 'Get user success!',
        GET_ALL_USERS: 'Get list users success!',
        DELETE_USER: 'Delete user success!'
    }
}

const ERROR_MESSAGES = {
    COMMON: {
        USER_NOT_FOUND: 'User not found!',
        REQUIRED_USER_ID: 'userId is required!',
        REQUIRED_EMAIL: 'Email is required!'
    },
    REGISTER: {
        EMAIL_ALREADY_TAKEN: 'Your email already exists! Please register with another email!',
        REGISTER_USER: {
            FAILED_TO_CREATE_USER: 'Failed to create new user!'
        },
        REGISTER_SELLER: {
            FAILED_TO_CREATE_SELLER: 'Failed to create new seller!'
        }
    },
    LOGIN: {
        EMAIL_NOT_FOUND: 'Email not registered!',
        INCORRECT_EMAIL_PASSWORD: 'Incorrect email or password!',
        FAILED_CREATE_TOKENS: 'Failed to create tokens!'
    },
    LOGOUT: {
        INVALID_REFRESH_TOKEN: 'RefreshToken not valid!',
        FAILED_TO_LOGOUT: 'Failed to logout!'
    },
    ACCESS_TOKEN: {
        INVALID_ACCESS_TOKEN: 'Invalid accessToken!'
    },
    REFRESH_TOKEN: {
        TOKENS_NOT_FOUND: 'Tokens not found!',
        FAILED_TO_CREATE_TOKENS: 'Failed to create tokens!',
        FAILED_TO_REMOVE_TOKENS: 'Failed to remove tokens!',
        FAILED_TO_VERIFY_REFRESH_TOKEN: 'Failed to verify refreshToken!',
        FAILED_TO_SAVE_TOKENS: 'Failed to save tokens!',
        FAILED_TO_GET_TOKENS: 'Failed to get tokens!'
    },
    USER: {
        GET_USER: 'Failed to get user!',
        GET_USER_BY_ID: 'Failed to get user by userId!',
        GET_USER_BY_EMAIL: 'Failed to get user by email!',
        GENERATE_EMAIL_VERIFICATION_CODE: 'Failed to generate email verification code!',
        GET_ALL_USERS: 'Failed to get all users!',
        DELETE_USER: 'Failed to delete user!'
    },
    ADMIN: {}
}

module.exports = {
    SUCCESS_MESSAGES,
    ERROR_MESSAGES
}
