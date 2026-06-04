import { Request, Response } from 'express';

const buildPublicImageUrl = (req: Request, filename: string): string => {
  const configured = process.env.API_PUBLIC_URL?.replace(/\/$/, '');
  if (configured) {
    return `${configured}/uploads/products/${filename}`;
  }
  const host = req.get('host');
  const protocol = req.protocol;
  return `${protocol}://${host}/uploads/products/${filename}`;
};

export const uploadProductImage = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const url = buildPublicImageUrl(req, req.file.filename);
    res.status(201).json({
      url,
      path: `/uploads/products/${req.file.filename}`,
      filename: req.file.filename,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    res.status(500).json({ message });
  }
};

export const uploadProductImages = (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const urls = files.map((file) => buildPublicImageUrl(req, file.filename));
    res.status(201).json({
      urls,
      paths: files.map((f) => `/uploads/products/${f.filename}`),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    res.status(500).json({ message });
  }
};
