import Joi from "joi";

const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().optional(),

  password: Joi.string().min(8).optional(),

  cpassword: Joi.string().valid(Joi.ref("password")).optional(),

  admin: Joi.boolean().optional(),
  block: Joi.boolean().optional(),
  profilePicture: Joi.string().allow("", null).optional(),
});

const userLoginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const songValidationSchema = Joi.object({
  _id: Joi.string().optional(),
  __v: Joi.string().optional(),
  title: Joi.string(),
  artist: Joi.string(),
  album: Joi.string(),
  duration: Joi.number().min(1),
  image: Joi.string().allow("", null).optional(),
  imageFile: Joi.string().allow("", null).optional(),
  audioFile: Joi.string().allow("", null).optional(),
  fileUrl: Joi.string().allow("", null).optional(),
  type: Joi.string(),
});

export {
  userValidationSchema,
  userLoginValidationSchema,
  songValidationSchema,
};
