const { FinanceClient, FinanceDoRenew } = require("../build/main/finance");
const { Session } = require("../build/main/lib/credentials");
const express = require("express");

const app = express();
app.use(express.json());
const port = 3000;

const session = new Session(
  {
    accessKey: "test_mch",
    secretKey: "bff149a0b87f5b0e00d9dd364e9ddaa0",
  },
  false
);
const client = new FinanceClient(session, "http://localhost:9000");

app.get("/subscribe", async (_req, res) => {
  const subReq = {
    user_id: "test_js_user",
    nickname: "test_js_nickname",
    product_id: "test_product_code_subscribe",
  };
  try {
    const resp = await client.CreateSubscribe(subReq);
    res.send(resp);
  } catch (error) {
    res.send(error.response.data);
  }
});

app.post("/callback", (req, res) => {
  try {
    const data = client.FinanceCallback(req);
    switch (data.do) {
      case FinanceDoRenew:
        // TODO handle
        console.log(data);
        res.status(200).send('success');
        break;
      default:
        res.send("unsupported action");
        break;
    }
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
