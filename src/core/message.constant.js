const SUCCESS_MESSAGES = {
    USER: {
        REGISTER_USER: 'Registration success for new user!',
        REGISTER_SELLER: 'Registration success for new seller! Please check your email to verify your account!',
        LOGIN: 'Login success!',
        LOGOUT: 'Logout success!',
        REFRESH_TOKENS: 'Refresh tokens successfully!',
        UPDATE_USER: 'Your profile had been updated successfully!',
        UPDATE_AVATAR: 'Your avatar had been updated successfully!',
        CHANGE_PASSWORD: 'Your password has been changed successfully!',
        GET_PROFILE: 'Get your profile successfully!',
        UPDATE_PROFILE: 'Your profile had been updated successfully!',
        VERIFY_EMAIL_SUCCESS: 'Your email had been verified successfully!',
        LOGIN_GOOGLE: 'Login with Google successfully!',
        UPGRADE_TO_SELLER: 'Your upgrade request has been sent! Please check your email to confirm!'
    },

    ADMIN: {
        GET_USER: 'Get user successfully!',
        GET_ALL_USERS: 'Get list users successfully!',
        DELETE_USER: 'Delete user successfully!',
        UPDATE_USER_ACTIVE_STATUS: {
            ACTIVE: 'User has been successfully activated!',
            INACTIVE: 'User has been successfully deactivated!'
        },
        UPDATE_USER: 'Update user successfully!',
        RESET_USER_PASSWORD: `Reset user password successfully! New password has been sent to user's email!`
    },

    FEATURE: {
        GET_FEATURES: 'Get list features successfully!'
    },

    CATEGORY: {
        GET_CATEGORIES: 'Get list categories successfully!'
    },

    LOCATION: {
        GET_PROVINCES: 'Get list provinces successfully!',
        GET_DISTRICTS: 'Get list districts successfully!',
        GET_WARDS: 'Get list wards successfully!'
    }
}

const ERROR_MESSAGES = {
    COMMON: {
        USER_NOT_FOUND: 'User not found!',
        REQUIRED_USER_ID: 'userId is required!',
        REQUIRED_EMAIL: 'Email is required!',
        NOTHING_TO_UPDATE: 'Nothing to update!',
        ACCOUNT_NOT_ACTIVE: 'Your account is not active!',
        EMAIL_NOT_VERIFIED: 'Please verify your email!'
    },

    ACCESS_TOKEN: {
        INVALID_ACCESS_TOKEN: 'Invalid accessToken!'
    },

    TOKENS: {
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
        DELETE_USER: 'Failed to delete user!',
        UPDATE_USER_ACTIVE_STATUS: 'Failed to update user active status!',
        FAILED_TO_UPDATE_USER: 'Failed to update user!',
        CAN_NOT_SAME_PHONE:
            'New phone number cannot be same as your current phone number. Please choose a different phone number!',
        FAILED_TO_VERIFY_EMAIL: 'There was an error verifying your email!',
        EMAIL_ALREADY_VERIFIED: 'Your email has already been verified!',
        UPDATE_AVATAR_FAILED: 'Failed to update your avatar!',
        INCORRECT_CURRENT_PASSWORD: 'Incorrect current password!',
        INVALID_EMAIL_VERIFICATION_CODE: 'Invalid email verification code!',
        CAN_NOT_SAME_PASSWORD:
            'New Password cannot be same as your current password. Please choose a different password!',
        CHANGE_PASSWORD_FAILED: 'Failed to change your password!',
        LOGIN_GOOGLE: {
            LOGIN_GOOGLE_FAILED: 'Failed to login with Google!',
            INVALID_CLIENT_ID: 'Invalid client ID!',
            INVALID_ACCESS_TOKEN: 'Invalid google access token!'
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
        }
    },

    ADMIN: {
        RESET_USER_PASSWORD_FAILED: 'Failed to reset user password!'
    },

    LOCATION: {
        INVALID_PROVINCE: 'Invalid province. Please try again!',
        INVALID_DISTRICT: 'Invalid district. Please try again!',
        INVALID_WARD: 'Invalid ward. Please try again!',
        INVALID_LOCATION_PROVIDED:
            'Complete address information required. You must provide provinceCode, districtCode, and wardCode together!',
        GET_PROVINCES: 'Failed to get list provinces!',
        GET_DISTRICTS: 'Failed to get list districts!',
        GET_WARDS: 'Failed to get list wards!',
        CREATE_NEW_LOCATION: 'Failed to create new location!',
        PROVINCES_NOT_FOUND: 'No province found!',
        DISTRICTS_NOT_FOUND: 'No district found!',
        WARDS_NOT_FOUND: 'No ward found!',
        REQUIRE_PROVINCE: 'Province code is required!',
        REQUIRE_DISTRICT: 'District code is required!'
    },

    AUTHENTICATION: {
        NOT_AUTHENTICATED: 'Please Authenticate!',
        PERMISSION_DENIED: 'Permission denied!'
    },

    SEND_EMAIL: {
        INVALID_EMAIL: `Invalid or missing recipient email address!`,
        FAILED_TO_SEND_EMAIL: 'Failed to send email!',
        INVALID_EMAIL_ID_OR_PASSWORD: 'Invalid email or newPassword!'
    },

    FEATURE: {
        GET_FEATURES: 'Failed to get list features!'
    },

    CATEGORY: {
        GET_CATEGORIES: 'Failed to get list categories!'
    }
}

const VERIFY_EMAIL_RESPONSE_MESSAGE = (message) => {
    return `
    <script>
        alert('${message} Click OK to redirect to home page!');
        window.location.href = 'https://house-sale-three.vercel.app/home';
    </script>
`
}

module.exports = {
    VERIFY_EMAIL_RESPONSE_MESSAGE,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES
}
