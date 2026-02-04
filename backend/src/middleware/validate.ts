import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodIssue } from 'zod';

export const validate = (schema: z.ZodObject<z.ZodRawShape>) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into a readable object
        const formattedErrors: Record<string, string> = {};
        
        error.issues.forEach((issue: ZodIssue) => {
          // Path format for this middleware is usually ['body', 'fieldName']
          // We want to extract 'fieldName'
          const fieldName = issue.path[1];
          if (fieldName) {
            formattedErrors[fieldName.toString()] = issue.message;
          } else {
             // Fallback if path is not structured as expected (e.g. root level)
             formattedErrors['error'] = issue.message;
          }
        });
        
        return res.status(400).json({ 
          success: false, 
          message: "Validation Error",
          errors: formattedErrors 
        });
      }
      return res.status(400).json({ success: false, message: 'Invalid Data' });
    }
  };
