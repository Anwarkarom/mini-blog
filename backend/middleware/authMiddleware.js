const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Jib l-token mn l-headers
    const token = req.header('Authorization')?.split(' ')[1]; // Bearer <TOKEN>

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // 2. Verifi l-token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Zid l-user data f l-request bach l-controllers yqdro y-accessiwha
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authMiddleware;