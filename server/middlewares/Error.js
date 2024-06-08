const Error = (err, req, res, next) => {

    const message = err.message || 'Something went wrong'
    const statusCode = err.status || 500

    return res.status(statusCode).json({
        success: false,
        message: message,
        error: err
    })
}

export default Error