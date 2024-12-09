import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
export const register = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            return res.status(400).json({error:"All fields are required"});
        }
        const existingUser=await prisma.user.findUnique({where:{email}});
        if(existingUser){
            return res.status(409).json({error:"Email already exists"});
        }

      //Hash PASSWORD
      const hashedPassword = await bcrypt.hash(password, 10);
      //CREATE A NEW USER AND SAVE IT TO THE DATABASE
      const newUser= await prisma.user.create({
          data:{
              username,
              email,
              password:hashedPassword,
            }
        });
        console.log(newUser)
        res.status(201).json({message: "User Created successfully",
            user:{
                id:newUser.id,
                username:newUser.username,
                email:newUser.email,
            },
        });
    }
    catch(error){
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const login = async (req, res) => {
  const {username,password}=req.body;
try { 
    //CHECK IF THE USER EXISTS 
    const user = await prisma.user.findUnique({where:{username}})
    if(!user){
        return res.status(401).json({Error:"Invalid Credentials!"});
    }
    // CHECK IF THE PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(401).json({Error:"Invalid Credentials!"});
    } 
    res.setHeader("Set-Cookie","test="+ "myValue").json("success")
}
catch(err){
    console.log(err)
    res.status(500).json({Error:"Failed to login"})
}
  

  //GENERATE A COOKIE TOKEN AND SEND IT TO THE USER 
};
export const logout = (req, res) => {
  //db operations
};
