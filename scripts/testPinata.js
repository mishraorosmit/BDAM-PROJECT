import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function testUpload() {
  try {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    // Replace with your test file path
    const filePath = "./test.png";

    const data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    const res = await axios.post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        Authorization: `Bearer ${process.env.VITE_PINATA_JWT}`,
        ...data.getHeaders(),
      },
    });

    console.log("SUCCESS ✅");
    console.log("CID:", res.data.IpfsHash);

  } catch (err) {
    console.error("ERROR ❌");
    console.error(err.response?.data || err.message);
  }
}

testUpload();