var express = require('express');
var router = express.Router();
var PassPort = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

PassPort.serializeUser(function (user, done) {
    done(null, user);
});

PassPort.deserializeUser(function (obj, done) {
    done(null, obj);
});

PassPort.use(new GitHubStrategy({
    clientID: '8a80649c6be6e6daf805',
    clientSecret: '863081ffb42021ebe8b569933716df2f9d7caf28',
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        // });
        done(null, profile);
    }
));

router.get('/github',
  PassPort.authenticate('github'));

router.get('/github/callback',
    PassPort.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        req.session.user = {
            id: req.user.id,
            username: req.user.displayName || req.user.username,
            avatar: req.user._json.avatar_url,
            provider: req.user.provider
    };
    res.redirect('/');
});

router.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;