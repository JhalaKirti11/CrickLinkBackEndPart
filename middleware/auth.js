import jwt from "jsonwebtoken"
export const auth = async (request,response,next)=>{
  try{
    let bearerToken = request.headers.authorization
    console.log("bearer : " + bearerToken);
    let token = bearerToken.split(" ")[1];
    console.log("Token : "+ token);
    jwt.verify(token,"fsdfsdrereioruxvxncnv");
    next();
  }
  catch(err){
    return response.status(401).json({error: "Bad request | Unauthorized user", err});
  }
}