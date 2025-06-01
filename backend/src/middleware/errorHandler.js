import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const globalErrorHandler = (err, _req, res, _next) => {
    console.error(`[Error]:`, err);

    if (err instanceof ApiError) {
        return res
            .status(err.statusCode)
            .json(new ApiResponse(err.statusCode, null, err.message));
    }

    return res
        .status(500)
        .json(new ApiResponse(500, null, 'Internal Server Error'));
};
