// Regex to validate the password, password should be min 8 length
exports.validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    return re.test(password);
};
