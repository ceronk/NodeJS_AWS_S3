import express from 'express';
import fileUpload from 'express-fileupload';
import { uploadFile, getFiles, getFile, downloadFile, getFileURL } from './s3.js';

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "./uploads"
}));

app.get("/", (req, res) => {
  res.json({ "message": "Hello there!" });
});

app.get("/files", async (req, res) => {
  const result = await getFiles();
  res.json(result.Contents);
});

app.get("/files/:fileName", async (req, res) => {
  const {fileName} = req.params;
  const result = await getFileURL(fileName);
  res.json({
    url: result
  });
});

app.get("/downloadfile/:fileName", async (req, res) => {
  const {fileName} = req.params;
  await downloadFile(fileName);
  res.json({"message": "File downloaded successfully"});
});

app.post("/files", async (req, res) => {
  const result = await uploadFile(req.files.file);
  res.json({result});
});

app.use(express.static("images"));

app.listen(app.get("port"), () => {
  console.log(`Server listening on port ` + app.get("port"));
});