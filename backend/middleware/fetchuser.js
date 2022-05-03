const jwt = require('jsonwebtoken');
const JWT_SECRET = "XYZisasecret";

const fetchuser = (req,res,next)=>{    // Note here next is used to call the next further upcoming function
    // The next() function is not a part of the Node.js or Express API but is the third argument that is passed to the middleware function. This means that the async(req, res) will be called after getting the user in the ‘getuser’ route.
    //Get the user from the jwt token and id to req object
    const token=req.header('auth-token')  //getting the token from the header
    if(!token){
        //If token is not present then show the error
        res.status(401).send({error:"Please authenticate using a valid token"})  
    }
    try {
        const data=jwt.verify(token,JWT_SECRET); //Verifying the token and jwt secret
        req.user=data.user;
        next(); //If verified then execute the next function

    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })  
    }
}

module.exports=fetchuser;