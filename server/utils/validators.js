import User from '../../models/User.model.js';
export function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export async function UserExists(email) {
    try {
        const user = await User.findOne({ where: { email } });
        return user !== null;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error checking if user exists:', error);
        return false;
    }
}
export function validatePhoneNumber(input_str) {
    const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

    return re.test(input_str);
}
