export const sendResponse = (
  res,
  data,
  status = 200,
  message = "Done",
  success = true,
) => {
    return res.status(status).send({ data, message, success });
};
 