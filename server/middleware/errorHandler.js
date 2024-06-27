const errorHandler = (err, req, res, next) => {
    const defaultError = {

        statusCode: 400,
        success: "false",
        error: err.message || err
    }

    const { statusCode, success, error } = defaultError
    res.status(statusCode).json({
        success: success,
        error: error
    })
}

export default errorHandler;