import { Handler } from "aws-lambda";

export const hello: Handler = (event) => {
  const response = {
    body: JSON.stringify({
      message: "Serverless Test"
    })
  };

  return new Promise((resolve) => {
    resolve(response);
  });
};
