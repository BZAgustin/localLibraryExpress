/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const {DateTime} = require('luxon');

const {Schema} = mongoose;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100},
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual('name').get(function() {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if(this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual('url').get(function() {
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual('lifespan').get(function() {
  if(this.date_of_birth && this.date_of_death) {
    return `${DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)} - ${DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)}`
  }
  
  if(this.date_of_birth) {
    return `${DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)}`
  }
  
  return `No info`
});

// Export model
module.exports = mongoose.model('Author', AuthorSchema);