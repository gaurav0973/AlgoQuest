/* eslint-disable no-unused-vars */
import { useEffect } from "react"
import { useForm } from 'react-hook-form';

function Signup() {

    const {register,handleSubmit,formState: { errors }} = useForm();


  return (
    <>
    
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('firstName')} placeholder="Enter firstname"/>
      <input {...register('email')} placeholder="Enter email"/>
      <input {...register('password')} placeholder="Enter password"/>
      <button type="submit" className="btn">Submit</button>
    </form>
    
    </>
  )
}
export default Signup