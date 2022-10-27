const { WeKeyClient } = require("../build/main/wekey");
const { Session } = require("../build/main/lib/credentials");
const express = require("express");

const app = express();
app.use(express.json());
const port = 3000;

const session = new Session(
  {
    accessKey: "cd7q8pc3c37lvrfjsge0",
    secretKey: "cd7q8pc3c37lvrfjsgeg",
  },
  false
);
const client = new WeKeyClient(session, "http://localhost:9000");

app.get("/register/qrcode", async (_req, res) => {
  const req = {
    user_id: "test_js_user",
    username: "test_js_nickname",
    display_name: "display_name",
  };
  try {
    const resp = await client.RegQRCode(req);
    res.send(resp);
  } catch (error) {
    res.send(error.response.data);
  }
});

app.get("/register/result/:msg_id", async (_req, res) => {
  const req = {
    msg_id: _req.params.msg_id,
  };
  try {
    const resp = await client.RegResult(req, function (user_id) {
      console.log("register success:", user_id);
    });
    res.send(resp);
  } catch (error) {
    res.send(error.response.data);
  }
});

app.get("/login/qrcode", async (_req, res) => {
  console.log("_req: ", _req);

  const req = {
    method: "qrcode",
    user_id: "test_js_user",
    username: "test_js_username",
  };
  try {
    const resp = await client.AuthRequest(req);
    res.send(resp);
  } catch (error) {
    res.send(error.response.data);
  }
});

app.get("/login/result/:msg_id", async (_req, res) => {
  const req = {
    msg_id: _req.params.msg_id,
  };
  try {
    const resp = await client.AuthResult(req, function (user_id) {
      console.log("login success:", user_id);
    });
    res.send(resp);
  } catch (error) {
    res.send(error.response.data);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
