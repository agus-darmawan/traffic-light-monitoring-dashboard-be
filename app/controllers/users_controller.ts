import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Technician from '#models/technician'
import Zone from '#models/zone'
import { responseUtil } from '../../helper/response_util.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class UsersController {
    async index({ params, response }: HttpContext) {
        const role = params.role;
        try {
          const users = await User.all();
          let data = await Promise.all(
            users
              .filter(user => user.role === role)
              .map(async user => {
                const userData: {
                  id: number;
                  email: string;
                  email_verified: boolean;
                  name: string | undefined;
                  zone_id: number | undefined;
                  zone_name: string | undefined;
                } = {
                  id: user.id,
                  email: user.email,
                  email_verified: !!user.emailVerifiedAt,
                  name: undefined,
                  zone_id: undefined,
                  zone_name: undefined,
                };
                
                if (role === 'technician') {
                  const technician = await Technician.findBy('user_id', user.id);
                  userData.name = technician ? technician.name : undefined;
                  userData.zone_id = technician? technician.zoneId : undefined;
                  if (userData.zone_id)  {
                    const zone = await Zone.findBy('id', userData.zone_id);
                    userData.zone_name = zone? zone.name : undefined;
                  }else{
                    userData.zone_id = 0;
                    userData.zone_name = '';
                  }
                }
                return userData;
              })
          );
          return responseUtil.success(response, data, 'Users retrieved successfully');
        } catch (error) {
          console.error('Error retrieving users:', error);
          return responseUtil.notFound(response, `An error occurred while retrieving users ${error.message}`);
        }
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
        console.log(params.id)
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
        const user = await User.findBy('id', params.id)
        if (!user) {
            return responseUtil.notFound(response)
        }
        await user.delete()
        return responseUtil.noContent(response, 'User deleted successfully')
    }
}