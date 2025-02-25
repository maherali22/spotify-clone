import * as Yup from "yup";

export const songValidationSchema = Yup.object().shape({
  title: Yup.string(),
  artist: Yup.string().required("Artist is required"),
  album: Yup.string().required("Album is required"),
  duration: Yup.number()
    .min(1, "Duration must be at least 1 minute")
    .required("Duration is required"),
  imageFile: Yup.mixed().nullable(),
  audioFile: Yup.mixed().nullable(),
  type: Yup.string().required("Type is required"),
});

export const schema = Yup.object({
  name: Yup.string().min(2).required("name is required"),
  email: Yup.string().email().required("email is required"),
  password: Yup.string().min(8).required("password is required"),
  cpassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "password is not matching"
  ),
});

export const loginschema = Yup.object({
  email: Yup.string().email().required("email is required"),
  password: Yup.string().min(8).required("password is required"),
});
