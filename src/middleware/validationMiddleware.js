const validateSignupForm = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    // Validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send("Invalid email format");
    }

    // Validating password (8 characters, including uppercase, lowercase, and digit)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).send("Password must be at least 8 characters and include uppercase, lowercase, and digit");
    }

    

    next();
};

module.exports = {
    validateSignupForm,
};
