import { Response } from "@adonisjs/core/http";

export const responseUtil = {
  success: (response: Response, data: any, message: string = 'Success') => {
    return response.status(200).json({ message, data });
  },
  created: (response: Response, data: any, message: string = 'Resource created successfully') => {
    return response.status(201).json({ message, data });
  },
  notFound: (response: Response, message: string = 'Resource not found') => {
    return response.status(404).json({ message });
  },
  noContent: (response: Response, message: string = 'Resource deleted successfully') => {
    return response.status(204).json({ message });
  }
};
