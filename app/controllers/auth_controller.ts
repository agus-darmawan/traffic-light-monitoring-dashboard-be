import ResetPasswordNotification from '#mails/reset_password_notification';
import VerifyEmailNotification from '#mails/verify_email_notification';
import User from '#models/user';
import type { HttpContext } from '@adonisjs/core/http';
import mail from '@adonisjs/mail/services/main';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
import { DateTime } from 'luxon';
import { responseUtil } from '../../helper/response_util.js';

export default class AuthController {
    async login({ request, response }: HttpContext) {
        const data = await vine
            .compile(
                vine.object({
                    email: vine.string().trim().email(),
                    password: vine.string(),
                })
            )
            .validate(request.all(), {
                messagesProvider: new SimpleMessagesProvider({
                    'required': 'The {{ field }} field is required.',
                    'email.email': 'The email must be a valid email address.',
                }),
            });

        try {
            const user = await User.verifyCredentials(data.email, data.password);
            const token = await User.authTokens.create(user, ['*'], { expiresIn: '1 year' });
            console.log(token);
            if (!token.value!.release()) {
                return responseUtil.conflict(response, 'Invalid email or password.');
            }
            console.log(token.value);
            return responseUtil.success(response, { token: token.value!.release() });
        } catch {
            return responseUtil.notFound(response, 'Invalid email or password.');
        }
    }

    async register({ request, response }: HttpContext) {
        const data = await vine
            .compile(
                vine.object({
                    email: vine.string().trim().email(),
                    password: vine.string().minLength(8).confirmed(),
                })
            )
            .validate(request.all(), {
                messagesProvider: new SimpleMessagesProvider({
                    'required': 'The {{ field }} field is required.',
                    'email.email': 'The email must be a valid email address.',
                    'unique': 'The {{ field }} has already been taken.',
                    'password.minLength': 'The password must be at least 8 characters.',
                    'password.confirmed': 'The password confirmation does not match.',
                }),
            });

        try {
            if (await User.query().where('email', data.email).first()) {
                return responseUtil.conflict(response, 'The email has already been taken.');
            }
            // only for production
            const user = await User.create({
                email: data.email,
                password: data.password,
            });
            // console.log(user);
            await mail.send(new VerifyEmailNotification(user));

            return responseUtil.success(response, null, 'Please check your email inbox (and spam) for an access link.');
        } catch (e) {
            return responseUtil.notFound(response, e.message);
        }
    }

    async user({ auth, response }: HttpContext) {
        return responseUtil.success(response, { user: auth.user });
    }

    async logout({ auth, response }: HttpContext) {
        await User.authTokens.delete(auth.user!, auth.user!.currentAccessToken.identifier);
        return responseUtil.noContent(response);
    }

    async resendVerificationEmail({ auth, response }: HttpContext) {
        try {
            if (auth.user!.emailVerifiedAt) {
                return responseUtil.notFound(response, 'Your email is already verified.');
            }

            await mail.send(new VerifyEmailNotification(auth.user!));

            return responseUtil.success(response, null, 'Please check your email inbox (and spam) for an access link.');
        } catch (e) {
            return responseUtil.notFound(response, e.message);
        }
    }

    async verifyEmail({ params, request, response }: HttpContext) {
        if (!request.hasValidSignature()) {
            return responseUtil.notFound(response, 'Invalid verification link.');
        }

        const email = decodeURIComponent(params.email);
        const user = await User.query().where('id', params.id).where('email', email).first();
        if (!user) {
            return responseUtil.notFound(response, 'Invalid verification link.');
        }

        if (!user.emailVerifiedAt) {
            user.emailVerifiedAt = DateTime.utc();
            await user.save();
        }

        return responseUtil.success(response, null, 'Email verified successfully.');
    }

    async forgotPassword({ request, response }: HttpContext) {
        const data = await vine
            .compile(
                vine.object({
                    email: vine.string().trim().email(),
                })
            )
            .validate(request.all(), {
                messagesProvider: new SimpleMessagesProvider({
                    'required': 'The {{ field }} field is required.',
                    'email.email': 'The email must be a valid email address.',
                }),
            });

        const user = await User.findBy('email', data.email);

        if (!user) {
            return responseUtil.notFound(response, "We can't find a user with that e-mail address.");
        }

        await mail.send(new ResetPasswordNotification(user));

        return responseUtil.success(response, null, 'Please check your email inbox (and spam) for a password reset link.');
    }

    async resetPassword({ params, request, response }: HttpContext) {
        if (!request.hasValidSignature()) {
            return responseUtil.notFound(response, 'Invalid reset password link.');
        }

        const user = await User.find(params.id);
        if (!user) {
            return responseUtil.notFound(response, 'Invalid reset password link.');
        }

        if (encodeURIComponent(user.password) !== params.token) {
            return responseUtil.notFound(response, 'Invalid reset password link.');
        }

        const data = await vine
            .compile(
                vine.object({
                    password: vine.string().minLength(8).confirmed(),
                })
            )
            .validate(request.all(), {
                messagesProvider: new SimpleMessagesProvider({
                    'required': 'The {{ field }} field is required.',
                    'password.minLength': 'The password must be at least 8 characters.',
                    'password.confirmed': 'The password confirmation does not match.',
                }),
            });

        user.password = data.password;
        await user.save();

        return responseUtil.success(response, null, 'Password reset successfully.');
    }
}
