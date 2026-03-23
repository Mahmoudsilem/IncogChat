function generateMessage(entity) {
  return {
    notFound: `${entity} Not Found`,
    alreadyExist: `${entity} Already Exist`,
    systemLogedInNotGoogle: `System Loged In User Can't Login With Google`,
    invalidCredentials: `Invalid Email Or Password`,
    failToCreateUser: `Failed To Create ${entity}`,
    failToUpdateUser: `Failed To Update ${entity}`,
    failToDeleteUser: `Failed To Delete ${entity}`,
    userCreated: `${entity} Created Successfully`,
    loginSuccess: `Login Successfull`,
    userUpdated: `${entity} Updated Successfully`,
    userDeleted: `${entity} Deleted Successfully`,
  };
}
export const SYS_MESSAGES = {
  user: generateMessage("User"),
  token:{
    invalid:"Invalid token"
  }
};
