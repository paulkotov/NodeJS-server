  // user routes
module.exports = function (app, passport, auth) {

  //User controller
  var users = require('../app/controllers/users');
  var pokemons = require('../app/controllers/pokemons');
  var authorization = require('./middlewares/authorization');
  var home = require('../app/controllers/home');

  app.get('/login', users.login);
  app.get('/logout', users.logout);

  app.get('/auth/facebook',
  passport.authenticate('facebook', {
      scope: ['email', 'user_about_me'],
      failureRedirect: '/login'
  }),
  users.signin
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
      failureRedirect: '/login' }),
    users.authCallback
);

app.get('/auth/vk',
  passport.authenticate('vk', {
      scope: ['friends']
  }),
  users.signin);

app.get('/auth/vk/callback',
  passport.authenticate('vk', {
      failureRedirect: '/login'
  }),
  users.authCallback
 );

  app.get('/auth/google', 
    passport.authenticate('google', 
          { scope: ['https://www.googleapis.com/auth/userinfo.profile', 
          'https://www.googleapis.com/auth/userinfo.email'] }), 
          users.signin);
          
  app.get('/auth/google/callback', 
    passport.authenticate('google', 
          { failureRedirect: '/login', successRedirect: '/' }), 
          users.authCallback); 
  
  app.get('/pokemons/showall', function(req, res){
    if (req.isAuthenticated()) {
      pokemons.showPokemons().then(data => {res.send(data)
        console.log(data);
      });

    }else {
      res.send({});
    }
  });

  app.post('/pokemons/add', (req, res) => {
    if (req.isAuthenticated()) {
      pokemons.addPokemon(req.body).then(() => {res.send('saved')}); 
    }else{
      res.send({});
    }
  });

  app.get('/pokemons/del/:name', (req, res) => {
    if (req.isAuthenticated()) {
      pokemons.delPokemon(req.params.name).then(() => {res.send('deleted')}); 
    }else{
      res.send({});
    }
  });

  app.get('/auth', (req, res) => {
    if (req.isAuthenticated()) {
      res.send(req.user);
    }
    else {
      res.send({});
    }
  });
  
  app.get('/', home.index);
}
