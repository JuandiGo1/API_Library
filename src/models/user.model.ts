import { model, Schema } from "mongoose";

// DECLARE MODEL TYPE
type UserType = {
  name: string;
  email: string;
  password: string;
  role: string; // 'admin' o 'user'
  isActive: boolean;
};

// DECLARE MONGOOSE SCHEMA
const UserSchema = new Schema<UserType>({
    name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
      },
      isActive: {
        type: Boolean,
        default: true, // Soft delete, usuario activo o inhabilitado
      },
});



// DECLARE MONGO MODEL
const UserModel = model<UserType>("User", UserSchema);

// EXPORT ALL
export { UserModel, UserSchema, UserType };
