import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { InferType } from "yup";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

const schema = yup.object().shape({
  name: yup.string().min(1, "Name is required").required(),
  email: yup.string().email("Invalid email").required(),
  password: yup.string().min(6, "Password is required").required(),
});

export type RegisterForm = InferType<typeof schema>;

export const useRegister = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(userCredential.user, {
        displayName: data.name,
      });
      alert("Registration successful!");
      reset();
      navigate("/login");
    } catch (error) {
      alert("Error: registration failed. Please try again.");
      console.error(error);
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
