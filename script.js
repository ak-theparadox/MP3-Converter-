// server.js
const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/convert', (req, res) => {
  const videoUrl = req.body.url;
  if (!videoUrl) return res.status(400).send('URL missing');

  const fileName = `output-${Date.now()}.mp3`;
  const command = `yt-dlp -x --audio-format mp3 -o ${fileName} ${videoUrl}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Conversion error');
    }
    res.download(fileName, () => {
      // Optionally delete file after sending
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
