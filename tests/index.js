const { FinanceClient } = require("../build/main/finance");
const { Session } = require("../build/main/lib/credentials");
const { HttpClient } = require("../build/main/lib/client/client");
const express = require("express");

const app = express();
const port = 3000;

const httpCli = new HttpClient("http://localhost:9000");

const session = new Session(
  {
    accessKey: "test_mch",
    secretKey: "bff149a0b87f5b0e00d9dd364e9ddaa0",
  },
  false
);
const client = new FinanceClient(session, httpCli);

app.get("/subscribe", (req, res) => {
  const subReq = {
    user_id: "test_js_user",
    nickname: "test_js_nickname",
    product_id: "test_product_code_subscribe",
  };
  try {
    const resp = client.CreateSubscribe(subReq);
    res.send(resp);
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
