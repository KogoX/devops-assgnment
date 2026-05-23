const express = require("express");

const app = express();
app.use(express.json());

app.post("/process", (req, res) => {
  const text = req.body.text;

  res.json({
    ts_worker: `TS processed: ${text}`
  });
});

app.listen(9000, "0.0.0.0", () => {
  console.log("TS worker running on port 9000");
});
