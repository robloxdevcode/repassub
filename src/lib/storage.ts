import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ACCOUNT_ID
    ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : undefined,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function getUploadUrl(key: string, contentType: string) {
  if (!process.env.R2_BUCKET_NAME) {
    return { uploadUrl: null, publicUrl: `/uploads/${key}` };
  }

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  const publicUrl = process.env.R2_PUBLIC_URL
    ? `${process.env.R2_PUBLIC_URL}/${key}`
    : uploadUrl;

  return { uploadUrl, publicUrl, key };
}

export async function getDownloadUrl(key: string) {
  if (!process.env.R2_BUCKET_NAME) return null;

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: 3600 });
}

export function generateFileKey(userId: string, fileName: string) {
  const ext = fileName.split(".").pop() || "bin";
  return `uploads/${userId}/${Date.now()}.${ext}`;
}
