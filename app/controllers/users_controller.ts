import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class UsersController {
    async index({ response }: HttpContext) {
        const users = await User.all()
        return responseUtil.success(response, users, 'Users retrieved successfully')
    }

    async show({ params, response }: HttpContext) {
        const user = await User.findBy('id', params.id)
        if (!user) {
            return responseUtil.notFound(response)
        }
        return responseUtil.success(response, user, 'User retrieved successfully')
    }

    async store({ request, response }: HttpContext) {
        const data = await vine
          .compile(
            vine.object({
                email: vine.string().trim().email(),
                password: vine.string().minLength(8).confirmed(),
                role: vine.string().trim(),
            })
          )
          .validate(request.all(), {
            messagesProvider: new SimpleMessagesProvider({
              'required': 'The {{ field }} field is required.',
              'password.minLength': 'The password must be at least 8 characters.',
              'email.email': 'The email must be a valid email address.',
            }),
          })
    
        const user = await User.create({
            email: data.email,
            password:  data.password,
            role: data.role,
        })
    
        return responseUtil.created(response, user)
    }

    async update({ params,request, response }: HttpContext) {
        const user = await User.findBy('id', params.id)
        if (!user) {
            return responseUtil.notFound(response)
        }
        const data = await vine
          .compile(
            vine.object({
                email: vine.string().trim().email(),
                role: vine.string().trim(),
            })
          )
          .validate(request.all(), {
            messagesProvider: new SimpleMessagesProvider({
              'required': 'The {{ field }} field is required.',
              'email.email': 'The email must be a valid email address.',
            }),
          })
          
        user.email = data.email
        user.role = data.role
        
        await user.save()
        return responseUtil.success(response, user, 'User updated successfully')
    }

    async destroy({ params, response }: HttpContext) {
        const user = await User.findBy('id', params.tid)
        if (!user) {
            return responseUtil.notFound(response)
        }
        await user.delete()
        return responseUtil.noContent(response, 'User deleted successfully')
    }
}