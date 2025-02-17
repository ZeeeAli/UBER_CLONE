const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"]
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"]
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email address"]
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  socketId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['ative', 'inactive'],
    default: 'inactive'
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minLength: [3, "Color must be at least 3 characters long"]
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, "Plate must be at least 7 characters long"]
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"],
    },
    vehicleType: {
      type: String,
      enum: ['car', 'bike', 'rickshaw'],
      required: true
    }
  },
  location: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    }
  }
})


captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
  return token
}

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10)
}

const captainModel = mongoose.model('captain', captainSchema)

module.exports = captainModel