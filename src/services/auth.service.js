import User from '../models/User.js'
import jwt  from 'jsonwebtoken'

const loginService = (email) => User.findOne({email: email}).select("+password")

const generateToken = (id) => jwt.sign({id: id}, )


export { loginService }