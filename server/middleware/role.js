import { errorResponse } from '../utils/apiResponse.js';

export const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return errorResponse(res, 'You do not have permission to perform this action', 403);
  }
  next();
};
