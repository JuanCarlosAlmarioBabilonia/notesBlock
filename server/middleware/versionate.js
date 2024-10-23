import semver from "semver";

const version = (expectedVersion) => {
    return (req, res, next) => {
        const requestVersion = req.headers["x-version"];
        if (requestVersion && semver.eq(requestVersion, expectedVersion)) {
            return next();
        }
        return res.status(400).json({ error: "Versión no compatible" });
    };
};

export default version;
