import { InvalidParamsError } from "../errors/invalid-params-error"
import { MissingParamsError } from "../errors/missing-params-error"
import { badRequest } from "../helpers/http-helpers"
import type { Controller } from "../protocols/controller"
import type { EmailValidator } from "../protocols/email-validator"
import type { HttpRequest, HttpResponse } from "../protocols/http"

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpRequest: HttpRequest): HttpResponse {
        const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

        for (const field of requiredFields) {
            if (!httpRequest.body[field]) {
                return badRequest(new MissingParamsError(field))
            }
        }

        const isValid = this.emailValidator.isValid(String(httpRequest.body.email))
        if (!isValid) {
            return badRequest(new InvalidParamsError('email'))
        }

        return {
            statusCode: 200,
            body: { message: 'Sign up successful' }
        }
    }
}
