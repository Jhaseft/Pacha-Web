const crypto = require("crypto");

// 👇 PEGA TUS CREDENCIALES AQUÍ
const apiKey = "1FCE08AA-C999-4126-B7ED-1LC5162D054F";
const secret = "5c8e1237d6136f06cda15ac2684f9321bc6c06a9";

const params = {
  amount: "1000",
  apiKey: apiKey,
  commerceOrder: "orden123",
  currency: "CLP",
  email: "test@test.com",
  subject: "Pago de prueba",
  urlConfirmation: "https://webhook.site/test", // puedes usar esto
  urlReturn: "https://google.com", // redirección simple
};

// ordenar alfabéticamente
const string = Object.keys(params)
  .sort()
  .map(key => key + "=" + params[key])
  .join("&");

const signature = crypto
  .createHmac("sha256", secret)
  .update(string)
  .digest("hex");

console.log("STRING A FIRMAR:\n", string);
console.log("\nFIRMA:\n", signature);