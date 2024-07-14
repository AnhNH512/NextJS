import { message } from "antd"

const errorMessage = (errMessage: string) => {
    message.destroy()
    message.warning(errMessage)
}

const successMessage = (errMessage: string) => {
    message.destroy()
    message.success(errMessage)
}


export {
    errorMessage,
    successMessage
}