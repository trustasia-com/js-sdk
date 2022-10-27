const { WeKeyApp } = require("../build/main/wekey/app");

const client = new WeKeyApp("http://localhost:3000");

let timerID;

client
  .RegQRCode("/register/qrcode")
  .then((qrcode) => {
    console.log(qrcode);

    if (timerID) {
      clearInterval(timerID);
    }

    const idx = qrcode.url.indexOf("#");
    const msgID = qrcode.url.substring(idx + 1);

    timerID = setInterval(async () => {
      const now = new Date().getTime() / 1000;
      if (now > qrcode.expires_at) {
        clearInterval(timerID);
        // TODO 超时，ui change;
        console.log("扫码超时");
        return;
      }
      try {
        const result = await client.RegResult(`/register/result/${msgID}`);

        switch (result.status) {
          case "init":
            // nothing todo
            console.log("等待扫描");
            break;
          case "bind":
            // TODO 已扫码，ui change
            console.log("已扫码：", result.wekey_user);
            break;
          case "fail":
            // TODO ui change
            clearInterval(timerID);
            console.log("认证失败，请重试");
            break;
          case "success":
            // 页面跳转
            clearInterval(timerID);
            console.log("login success");
        }
      } catch (error) {
        clearInterval(timerID);
        console.log(error);
        return;
      }
    }, 1000);
  })
  .catch((err) => {
    console.log(err);
  });
