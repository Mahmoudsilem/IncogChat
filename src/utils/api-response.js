export const sendResponse = (
  res,
  data,
  status = 200,
  massege = "Done",
  success = true,
) => {
    return res.status(status).send({ data, massege, success });
};
