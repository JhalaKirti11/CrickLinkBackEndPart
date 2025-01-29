import jwt from "jsonwebtoken"
export const auth = async (request,response,next)=>{
  try{
    let bearerToken = request.headers.authorization
    let token = bearerToken.split(" ")[1];
    jwt.verify(token,"fsdfsdrereioruxvxncnv");
    next();
  }
  catch(err){
    return response.status(401).json({error: "Bad request | Unauthorized user"});
  }
}