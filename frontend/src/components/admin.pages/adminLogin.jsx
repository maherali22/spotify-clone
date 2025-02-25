import { loginschema } from "../../redux/validations";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminlogin } from "../../redux/slice/admin/adminLoginSlice";

const initialvalue = {
  email: "",
  password: "",
};
const AdminLogin = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  const navigate = useNavigate();
  const { errors, values, handleChange, handleSubmit, touched, resetForm } =
    useFormik({
      initialValues: initialvalue,
      validationSchema: loginschema,
      onSubmit: async () => {
        dispatch(adminlogin(values));
        resetForm();
        navigate("/admin");
      },
    });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
          alt="Spotify Logo"
          className="w-20 mb-6 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-6 text-center">Spotify Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1" aria-live="polite">
                {errors.email}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm mt-1" aria-live="polite">
                {errors.password}
              </p>
            )}
            {error && (
              <p className="text-red-500 text-sm mt-1" aria-live="polite">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md font-medium transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
