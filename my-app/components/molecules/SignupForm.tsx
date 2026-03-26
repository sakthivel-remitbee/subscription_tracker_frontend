"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "@/redux/userSlice";
import { AppDispatch, RootState } from "@/redux/store";


export default function SignupForm() {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.user);



    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            email: Yup.string().email("Invalid").required("Required"),
            password: Yup.string().min(6).required("Required"),
        }),
        onSubmit: (values) => {
            dispatch(signup(values));
        },
    });


    const strength = formik.values.password.length > 5 ? "strong" : formik.values.password.length > 2 ? "medium": "weak";
    const getColor = () => {
        if (strength === "weak") return "bg-red-400";
        if (strength === "medium") return "bg-orange-400";
        if (strength === "strong") return "bg-green-400";
        return "bg-white/10";
    };

    const level = {weak: 1,medium: 2, strong: 3,}[strength] || 0;

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
                <label className="text-xs text-gray-400">Full name</label>
                <Input
                    name="name"
                    placeholder="Alex Johnson"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                />
            </div>

            <div>
                <label className="text-xs text-gray-400">Email address</label>
                <Input
                    name="email"
                    placeholder="alex@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
            </div>


            <div>
                <p className="text-xs text-gray-400">Password</p>
                <Input
                    name="password"
                    type="password"
                    placeholder="password123"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                />

                {formik.values.password && (
                    <>
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`h-1 flex-1 rounded ${level >= i ? getColor() : "bg-white/10"
                                        }`}
                                />
                            ))}
                        </div>

                        <p
                            className={`text-xs mt-1 capitalize ${strength === "weak"
                                    ? "text-red-400"
                                    : strength === "medium"
                                        ? "text-orange-400"
                                        : "text-green-400"
                                }`}
                        >
                            {strength} password
                        </p>
                    </>
                )}

            </div>

            <Button text="Create Account" loading={loading} />

            {error && (
                <p className="text-xs text-red-400 text-center">{error}</p>
            )}
        </form>
    );
}