const isAdmin = (req, res, next) => {
    if (req.user.role !== "Super Admin") {
        return res.status(403).json({ status: false, message: "Super Admin access only !" });
    }
    next();
}

module.exports =  isAdmin;
