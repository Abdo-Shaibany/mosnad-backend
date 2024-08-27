import { Request, Response, NextFunction } from 'express';
import { MyPrisma } from './prisma';
import fs from 'fs';
import path from 'path';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
import { Image } from 'src/models/image.model';

const prisma = MyPrisma.getInstance();

export const getImageById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const data = await prisma.image.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(data);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const createImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { url, thumbnail_url } = req.body as Image;
  try {
    const data: Image = await prisma.image.create({
      data: { url, thumbnail_url },
    });

    res.status(200).json(data);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const deleteImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await prisma.image.findUnique({
      where: {
        id: parseInt(req.params['id']),
      },
    });

    await prisma.image.delete({
      where: {
        id: parseInt(req.params['id']),
      },
    });

    fs.unlinkSync(path.resolve('public', data!.thumbnail_url));
    fs.unlinkSync(path.resolve('public', data!.url));
    res.status(200).json();
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};
