

function userManager() {
    // verify = (req, res, next) => {
    //     console.log("Verifying?");
    //     try {
    //         const token = req.cookies.token;
    //         if (!token) {
    //             return res.status(401).json({
    //                 error: true,
    //                 message: "Unauthorized"
    //             })
    //         }

    //         const verified = jwt.verify(token, process.env.JWT_SECRET)
    //         console.log("verified.userId: " + verified.userId);
    //         req.userId = verified.userId;

    //         next();
    //     } catch (err) {
    //         console.error(err);
    //         return res.status(401).json({
    //             error: true,
    //             message: "Unauthorized"
    //         });
    //     }
    // }

    // verifyUser = (req) => {
    //     try {
    //         const token = req.cookies.token;
    //         if (!token) {
    //             return null;
    //         }

    //         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    //         return decodedToken.userId;
    //     } catch (err) {
    //         return null;
    //     }
    // }

    // signToken = (userId) => {
    //     return jwt.sign({
    //         userId: userId
    //     }, process.env.JWT_SECRET);
    // }

    // return this;
}

const auth = userManager();
module.exports = auth;