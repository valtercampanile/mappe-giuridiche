import { Request, Response, NextFunction } from 'express';
import { uploadService } from '../services/upload.service';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export const adminController = {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthenticatedRequest;
      const { content, filename } = req.body as { content: string; filename: string };

      if (!content) {
        res
          .status(400)
          .json({ success: false, error: 'Campo content mancante', code: 'MISSING_CONTENT' });
        return;
      }

      const result = await uploadService.createUpload(
        authReq.user.userId,
        filename || 'upload.json',
        content,
      );
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getUpload(req: Request, res: Response, next: NextFunction) {
    try {
      const upload = await uploadService.getUpload(req.params.id as string);
      res.json({ success: true, data: upload });
    } catch (err) {
      next(err);
    }
  },

  async listUploads(_req: Request, res: Response, next: NextFunction) {
    try {
      const uploads = await uploadService.getUploads();
      res.json({ success: true, data: uploads });
    } catch (err) {
      next(err);
    }
  },

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const { approvedIds, rejectedIds } = req.body as {
        approvedIds: string[];
        rejectedIds: string[];
      };

      if (!Array.isArray(approvedIds)) {
        res.status(400).json({
          success: false,
          error: 'approvedIds deve essere un array',
          code: 'INVALID_INPUT',
        });
        return;
      }

      const result = await uploadService.applyApproved(
        req.params.id as string,
        approvedIds,
        rejectedIds ?? [],
      );
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
