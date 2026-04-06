"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "@/redux/userSlice";
import { AppDispatch, RootState } from "@/redux/store";

const getStrength = (password: string) => {
  if (password.length === 0) return null;
  if (password.length < 4) return "weak";
  if (password.length < 6) return "fair";
  return "strong";
};

const strengthConfig = {
  weak:   { level: 1, color: "bg-red-400",    text: "text-red-400",    label: "Weak password" },
  fair:   { level: 2, color: "bg-orange-400", text: "text-orange-400", label: "Fair password" },
  strong: { level: 3, color: "bg-green-400",  text: "text-green-400",  label: "Strong password" },
};

export default function SignupForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: Yup.object({
      name:     Yup.string().required("Full name is required"),
      email:    Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6,"").required("Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(signup(values));
    },
  });

  const strength = getStrength(formik.values.password);
  const config = strength ? strengthConfig[strength] : null;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">

      <div>
        <label className="text-xs text-gray-400">Full name</label>
        <Input
          name="name"
          placeholder="Alex Johnson"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.name && formik.errors.name)}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {formik.errors.name}
          </p>
        )}
      </div>

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
        <label className="text-xs text-gray-400">Password</label>
        <Input
          name="password"
          type="password"
          placeholder="password123"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.password && formik.errors.password)}
        />

        {formik.values.password && config && (
          <>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded transition-all duration-300 ${
                    config.level >= i ? config.color : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs mt-1 ${config.text}`}>{config.label}</p>
          </>
        )}

        
        {formik.touched.password && formik.errors.password && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {formik.errors.password}
          </p>
        )}
      </div>

      <Button text="Create Account" loading={loading} />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

    </form>
  );
}
