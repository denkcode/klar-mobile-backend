
export const sendEmail = async (options) => {
  const brevoBody = {
    sender: { email: options.from },
    to: [{ email: options.to }],
    subject: options.subject,
    htmlContent: options.html,
  };
 const apiKey = process.env.BREVO_APIKEY;

    console.log(apiKey);
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": `${process.env.BREVO_APIKEY}`,
      accept: "application/json",
    },
    body: JSON.stringify(brevoBody),
  });
  console.log(response.status);

  if (response.ok === false) {
    const errorBody = await response.text();
    console.log(errorBody);
    throw new Error("Failed to sent email");
  }
  return response;
};
