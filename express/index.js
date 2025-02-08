import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";

const app = express();

dotenv.config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const cloudFront = new CloudFrontClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/post", upload.single("image"), async (req, res) => {
  const image = req.file;
  const { caption } = req.body;
  const imageName = crypto.randomBytes(32).toString("hex");

  const params = {
    Bucket: BUCKET_NAME,
    Key: imageName,
    Body: image.buffer,
    ContentType: image.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  const post = await prisma.image.create({
    data: {
      image_name: imageName,
      caption,
    },
  });

  return res.json(post);
});

app.get("/api/posts", async (req, res) => {
  const posts = await prisma.image.findMany();

  for (const post of posts) {
    post.url = process.env.CLOUDFRONT_URL + `/${post.image_name}`;
  }
  return res.json(posts);
});

app.delete("/api/post/:id", async (req, res) => {
  const { id } = req.params;

  const post = await prisma.image.findUnique({ where: { id: Number(id) } });

  if (!post) {
    return res.status(404).send("Image not found");
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: post.image_name,
  };

  const command = new DeleteObjectCommand(params);
  await s3.send(command);

  const invalidationParams = {
    DistributionId: process.env.DISTRIBUTION_ID,
    InvalidationBatch: {
      CallerReference: post.image_name,
      Paths: {
        Quantity: 1,
        Items: [`/${post.image_name}`],
      },
    },
  };

  const invalidationCommand = new CreateInvalidationCommand(invalidationParams);
  await cloudFront.send(invalidationCommand);

  await prisma.image.delete({ where: { id: Number(id) } });
  return res.status(200).json(post);
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
