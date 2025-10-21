
import validator from 'validator'

export const userValidator = (data)=>{

    const requiredField = ["firstName", "emailId", "password"]
    const isAllowed = requiredField.every((k)=>Object.keys(data).includes(k))
    
    if(!isAllowed){
        throw new Error("Some fields are missing")
    }else if(!validator.isEmail(data.emailId)){
        throw new Error("Enter a valid Email")
    }else if(!validator.isStrongPassword(data.password)){
        throw new Error("Enter a strong password")
    }
}

export const loginValidator = (data)=>{

    const requiredField = ["emailId", "password"]
    const isAllowed = requiredField.every((k)=>Object.keys(data).includes(k))

    if(!isAllowed){
        throw new Error("Some fields are missing")
    }else if(!validator.isEmail(data.emailId)){
        throw new Error("Enter a valid Email")
    }else if(!validator.isStrongPassword(data.password)){
        throw new Error("Enter a strong password")
    }

}