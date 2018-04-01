var mongoose = require('mongoose')
, Pokemon = mongoose.model('Pokemon');

exports.addPokemon = function(data){
    var pokemon = new Pokemon({
        name: data.name,
        url: data.url
    });
    return new Promise ( (resolve, reject) => { 
        pokemon.save( (err, res) => {
            if (err) { reject(new Error("Error")); }
            resolve(res);
        });
    }); 
}

exports.showPokemons = function(){
  return new Promise ((resolve, reject) => {
    Pokemon.find( (err, res) => {
        if (err) { reject(new Error("Error")); }
        resolve(res);
        });
    }); 
}

exports.delPokemon = function(name){
    return new Promise ((resolve, reject) => {
        Pokemon.findOne({ 'name' : name }).remove( (err, res) => {
            if (err) { reject(new Error("Error")); }
            resolve(res);
            });
        });  
}