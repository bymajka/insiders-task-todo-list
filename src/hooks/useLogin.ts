import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export type LoginForm = yup.InferType<typeof schema>;

export const useLogin = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginForm>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      alert("Login successful!");
      reset();
      navigate("/dashboard");
    } catch (error: any) {
      alert("Error: login failed. Please try again.");
      console.error("Login failed: " + error.message);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
  };
};
