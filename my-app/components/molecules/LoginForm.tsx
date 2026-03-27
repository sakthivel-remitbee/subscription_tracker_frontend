"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";


export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  return (
    
    <form onSubmit={formik.handleSubmit} className="space-y-4">

      <div>
        <label className="text-xs text-gray-400">Email address</label>
        <Input
          name="email"
          placeholder="alex@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.email && formik.errors.email)}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {formik.errors.email}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-gray-400">Password</label>
          <span
            onClick={() => router.push("/forgot-password")}
            className="text-xs text-purple-400 cursor-pointer hover:text-purple-300 transition-colors"
          >
            Forgot password?
          </span>
        </div>
        <Input
          name="password"
          type="password"
          placeholder="••••••••••••"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.password && formik.errors.password)}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {formik.errors.password}
          </p>
        )}
      </div>

      <Button text="Sign In" loading={loading} />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

    </form>
  );
}