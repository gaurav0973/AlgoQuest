/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../utils/authSlice";
import { useEffect, useState } from "react";

const signupSchema = z.object({
  firstName: z.string().min(3, "Name should be atleast 3 characters"),
  emailId: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

function Signup() {

  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md flex flex-col items-center space-y-6">
        <h1 className="text-2xl font-bold">AlgoQuest</h1>
        <form
          className="w-full flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* First Name Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              {...register("firstName")}
              placeholder="Enter firstname"
              className="input input-bordered w-full"
            />
            {errors.firstName && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.firstName.message}
                </span>
              </label>
            )}
          </div>

          {/* Email Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              {...register("emailId")}
              placeholder="Enter email"
              className="input input-bordered w-full"
            />
            {errors.emailId && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.emailId.message}
                </span>
              </label>
            )}
          </div>

          {/* Password Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                {...register("password")}
                placeholder="********"
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>


        <div>
          <p>Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
export default Signup;
