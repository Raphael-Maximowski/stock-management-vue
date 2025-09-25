const DEFAULT_ERROR_MESSAGE = 'Ocorreu um erro! Tente novamente'

export const generateApiError = (error) => {
    let errorMessage = null

    if (error?.details && typeof (error.details) === 'object') {
        const errorObjectKeys = Object.keys(error?.details)
        const fistErrorField = errorObjectKeys[0]

        errorMessage = `${fistErrorField} ${error.details[fistErrorField]}`
    } else {
        errorMessage = typeof (error === 'string') ? error : DEFAULT_ERROR_MESSAGE
    }

    return errorMessage
}