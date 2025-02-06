import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";

const Register = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    type: "1",
    timezone: "Asia/Kolkata",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
  });

  const navigate = useNavigate();
  const handlelogin=()=>{
    navigate("/login")
  }
  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await axios.post("http://localhost:4000/api/users/register", values);
      alert("Registered successfully");
      navigate("/login");
    } catch {
      alert("Error registering user");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Register</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form>
            <Field name="firstName" placeholder="First Name" />
            <ErrorMessage name="firstName" component="div" className="error" />

            <Field name="lastName" placeholder="Last Name" />
            <ErrorMessage name="lastName" component="div" className="error" />

            <Field name="email" type="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" className="error" />

            <Field name="password" type="password" placeholder="Password" />
            <ErrorMessage name="password" component="div" className="error" />

            <Field as="select" name="type">
              <option value="1">Doctor</option>
              <option value="2">Patient</option>
            </Field>

            <Field as="select" name="timezone">
              <option value="Asia/Kolkata">India</option>
              <option value="America/Phoenix">Arizona, USA</option>
            </Field>

            <button type="submit">Register</button>
            <button onClick={handlelogin}>login</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
