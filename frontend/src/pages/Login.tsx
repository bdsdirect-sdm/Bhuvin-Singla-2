import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });
  const handleRegister = () => {
    navigate("/")
  }
  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await axios.post("http://localhost:4000/api/users/login", values);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/profile");
    } catch (error) {
      console.log("Error:-", error);
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error.response?.data?.error || error.message);
        alert((error as any).response?.data?.error || "Login failed");
      } else {
        console.error("Login error:", (error as Error).message);
        alert("Login failed");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="header-text">Login</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form>
            <Field name="email" type="email" placeholder="Email" className="formik-input" />
            <ErrorMessage name="email" component="div" className="error" />

            <Field name="password" type="password" placeholder="Password" className="formik-input" />
            <ErrorMessage name="password" component="div" className="error" />

            <button type="submit">Login</button>
            <button onClick={handleRegister}>Register</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
