const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/convert', (req, res) => {
  const videoUrl = req.body.url;
  if (!videoUrl) return res.status(400).send('URL missing');

  const outputDir = path.join(__dirname, 'downloads');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const timestamp = Date.now();
  const fileName = `output-${timestamp}.mp3`;
  const filePath = path.join(outputDir, fileName);

  const command = `yt-dlp -x --audio-format mp3 -o '${filePath}' ${videoUrl}`;
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Conversion error');
    }
    res.download(filePath, fileName, () => {
      fs.unlinkSync(filePath); // Delete file after sending
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
