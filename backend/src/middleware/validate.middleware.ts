import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Express req.body is typed as any
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: err.errors.map((e) => e.message).join(', '),
          code: 'VALIDATION_ERROR',
        });
        return;
      }
      next(err);
    }
  };
}
