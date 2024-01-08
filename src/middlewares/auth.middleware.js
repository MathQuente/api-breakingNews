import 'dotenv/config'
import userService from '../services/user.service.js'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) =>{
  try{
    
  const { authorization } = req.headers

  if(!authorization){
    return res.send(401)
  }

  const parts = authorization.split(' ')

  if(parts.length !== 2){
    return res.send(401)
  }
  
  const [schema, token] = parts

  if(schema !== "Bearer"){
    return res.send(401)
  }

  jwt.verify(token, process.env.SECRET_JWT_KEY,  async(error, decoded) => {
    if(error){
      return res.status(401).send({message: 'Token invalid!'})
    }
    const user = await userService.findByIdService(decoded.id)
    if(!user || !user.id){
      return res.status(401).send({message: "Invalid token!"})
    }
  
    req.userId = user._id

    return next()
  })

  }catch(error){
    res.status(500).send({ message: error.message })
  }
}