const crypto = require("crypto");
const https = require("https");
const querystring = require("querystring");

// 🔐 TUS CREDENCIALES
const apiKey = "1FCE08AA-C999-4126-B7ED-1LC5162D054F";
const secret = "5c8e1237d6136f06cda15ac2684f9321bc6c06a9";

// 📦 Parámetros del pago
const params = {
  amount: "1",
  apiKey: apiKey,
  commerceOrder: "orden_" + Date.now(),
  currency: "PEN",
  email: "jhasesaat@gmail.com",
  subject: "Pago de prueba",
  urlConfirmation: "https://webhook.site/test",
  urlReturn: "https://google.com",
};

// 🔑 Generar firma
const stringToSign = Object.keys(params)
  .sort()
  .map(key => key + "=" + params[key])
  .join("&");

const signature = crypto
  .createHmac("sha256", secret)
  .update(stringToSign)
  .digest("hex");

// agregar firma
params.s = signature;

// convertir a x-www-form-urlencoded
const postData = querystring.stringify(params);

// ⚡ Request a Flow
const options = {
  hostname: "www.flow.cl",
  path: "/api/payment/create",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": Buffer.byteLength(postData),
  },
};

const req = https.request(options, res => {
  let data = "";

  res.on("data", chunk => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("Respuesta de Flow:");
    console.log(data);

    try {
      const json = JSON.parse(data);
      if (json.url) {
        console.log("\n🔗 URL de pago:");
        console.log(json.url + "?token=" + json.token);
      }
    } catch (e) {
      console.log("No se pudo parsear JSON");
    }
  });
});

req.on("error", error => {
  console.error("Error:", error);
});
console.log("POST DATA:");
console.log(postData);
// enviar datos
req.write(postData);
req.end();