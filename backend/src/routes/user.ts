import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

import { Hono } from 'hono'
import { sign , verify } from 'hono/jwt'
import {signupZodCheck} from '@kedar0011/medium-common'


export const userRoute = new Hono<{
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET : string
    }
}>()



userRoute.post('/signup', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const body = await c.req.json();

    const { success } = signupZodCheck.safeParse(body)
    
    const user = await prisma.user.create({
      data : {
        email : body.email,
        password : body.password
      },
    })
    
    const jwt = await sign({id : user.id} , c.env.JWT_SECRET)
    
    
      return c.json({token : jwt})
    })
    
    
    //----------------------------------------------------------------------------------------
    
    userRoute.post('/signin', async (c) => {
      const prsima = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    
      }).$extends(withAccelerate())
    
      const body = await c.req.json();
      const user = await prsima.user.findUnique({
        where : {
          email : body.email,
          password : body.password
        }
      })
    
      if(!user){
        c.status(404)
        return c.json({mssg : "user not found !"})
      }
      const jwt = await sign({id : user.id} , c.env.JWT_SECRET)
    
      return c.json({token : jwt})
    })
    
    //---
