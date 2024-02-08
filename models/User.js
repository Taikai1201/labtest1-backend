const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
 
      username: {
        type: String,
        required: true,
        unique: true, 
        maxlength: 50,
      },
      firstname: {
        type: String,
        minlength: 3,
        required: true,
      },
      lastname: {
        type: String,
        minlength: 3,
        required: true,
      },
      password: {
        type: String,
        required: true,
        validate: {
          validator: function(p) {
            return p.length >= 5;
          },
          message: props => `${props.value} is an invalid password, make sure it has at least 5 characters`
        }
      },
      createon: {
        type: Date,
        required: true,
        default: Date.now 
      }
})

const Users = mongoose.model("Users", UserSchema)

module.exports = Users