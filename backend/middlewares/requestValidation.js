const jwt = require('jsonwebtoken')

const ensureAuthenticated = async (req, res, next) => {
    const auth = req.headers['authorization']
    if(!auth){
        return res.status(403).json({
            message : "Unauthorized access!!! JWT Token required",
            success : false
        })
    }

    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message : "Unauthorized access!!! JWT Token is incorrect or expired",
            success : false
        })
    }
}

module.exports = {
    ensureAuthenticated
}