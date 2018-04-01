
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var PokemonSchema = new Schema({
    name: {type: String},
    url: {type: String}
  });

mongoose.model('Pokemon', PokemonSchema)