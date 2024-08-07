// middleware/is-signed-in.js
const isSignedIn = (req, res, next) => {
    if (req.session.user) {
        next(); // User is signed in, proceed to the next middleware or route handler
    } else {
        res.redirect('/auth/sign-in'); // Redirect to the sign-in page if not signed in
    }
};

export default isSignedIn;
