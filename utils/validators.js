const validateName = (name) => {
    const nameRegex = new RegExp(/[a-zA-z][a-zA-z]+[a-zA-Z]$/);
    return nameRegex.test(name);
};

const validateEmail = (email) => {
    const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const passRegex = new RegExp(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    );
    return passRegex.test(password);
};

module.exports = {
    validateName,
    validateEmail,
    validatePassword,
};
