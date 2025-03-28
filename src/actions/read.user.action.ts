import { UserModel, UserType } from "../models/user.model";

// DECLARE ACTION FUNCTION
async function readUserAction(): Promise<UserType[]> {
  const results = await UserModel.find();

  return results;
}

// EXPORT ACTION FUNCTION
export default readUserAction;
