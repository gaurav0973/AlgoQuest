/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginUser } from '../utils/authSlice';
import { useEffect } from 'react';

const loginSchema = z.object({
    emailId: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password should be atleast 8 characters")
})

function Login() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {isAuthenticated, loading, error} = useSelector((state) => state.auth)



    const {register,handleSubmit,formState: { errors }} = useForm({
        resolver : zodResolver(loginSchema)
    });

    useEffect(()=> {
          if(isAuthenticated){
            navigate("/")
          }
    }, [isAuthenticated, navigate])


    const onSubmit = (data)=>{
        dispatch(loginUser(data))
    }

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-md flex flex-col items-center space-y-6'>
        <h1 className='text-2xl font-bold'>Login</h1>
        <form className='w-full flex flex-col space-y-4' onSubmit={handleSubmit(onSubmit)}>
          
          {/* Email Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input 
              {...register('emailId')} 
              placeholder="Enter email"
              className='input input-bordered w-full'
            />
            {errors.emailId && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.emailId.message}</span>
              </label>
            )}
          </div>
          
          {/* Password Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input 
              {...register('password')} 
              placeholder="Enter password" 
              type="password"
              className='input input-bordered w-full'
            />
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.password.message}</span>
              </label>
            )}
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
export default Login