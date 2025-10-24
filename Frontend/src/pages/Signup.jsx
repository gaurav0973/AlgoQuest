/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; 

const signupSchema = z.object({
    firstName:  z.string().min(3, "Name should be atleast 3 characters"),
    emailId: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password should be atleast 8 characters")
})

function Signup() {
    const {register,handleSubmit,formState: { errors }} = useForm({
        resolver : zodResolver(signupSchema)
    });

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-md flex flex-col items-center space-y-6'>
        <h1 className='text-2xl font-bold'>AlgoQuest</h1>
        <form className='w-full flex flex-col space-y-4' onSubmit={handleSubmit((data) => console.log(data))}>
          
          {/* First Name Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input 
              {...register('firstName')} 
              placeholder="Enter firstname"
              className='input input-bordered w-full'
            />
            {errors.firstName && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.firstName.message}</span>
              </label>
            )}
          </div>
          
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
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
export default Signup