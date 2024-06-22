import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

import { Hono } from 'hono'
import { sign , verify } from 'hono/jwt'
import { string } from 'zod'
import {createBlogZodCheck , updateBlogZodCheck} from '../zod'


export const blogRoute = new Hono<{
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET : string
    },
    Variables : {
        userId :string;
    }
}>()     
    

blogRoute.use('/*' , async (c , next) =>{
    console.log("called middleware");
    
    const authHeader = c.req.header('authorization') || ""
    const user = await verify(authHeader , c.env.JWT_SECRET)
    
    if (user && typeof user.id === 'string') {
        c.set("userId", user.id)
        await next()
    }else {
        c.status(411);
        return c.json({mssg : "your are not logged in "})
    }
})

//----------------------------------------------------------------------------------------
blogRoute.post('/', async (c) => {

    const prsima = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    
    }).$extends(withAccelerate())
    
    const body = await c.req.json();

    const { success } = createBlogZodCheck.safeParse(body)
    console.log("aftersuccess");
    
    if(! success ){
        c.status(404)
        return c.json({mssg : "Invalid input"})
      }

    const userId = c.get("userId")
    try {
        const blog = await prsima.blog.create({
            data : {
                title : body.title,
                content : body.content,
                authorId : userId
            }
        })
        return c.json({mssg : blog.id})
        
    } catch (error) {
        c.status(404);
        return c.json({
            mssg : "you are not logged in" , err : error
        })

    }
    })
    
    
    //----------------------------------------------------------------------------------------
    blogRoute.put('/', async(c) => {
    
    const prsima = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    
    }).$extends(withAccelerate())
    
    const body = await c.req.json();

    const { success } = updateBlogZodCheck.safeParse(body)

    if(! success ){
        c.status(404)
        return c.json({mssg : "Invalid input"})
      }
    
    try {
        const blog = await prsima.blog.update({
            where : {
                id : body.id
            },
            data : {
                title : body.title,
                content : body.content
                
            }
        })
        return c.json({mssg : blog.id})
      
        
    } catch (error) {
        c.status(404);
        return c.json({
            mssg : "you are not logged in"
        }) 
    }
})
    
 

//----------------------------------------------------------------------------------------

blogRoute.get('/bulk', async (c)=>{

    const prsima = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    
    }).$extends(withAccelerate())

    const body = await c.req.json();

    const blog = await prsima.blog.findMany()
    return c.json({mssg : blog})
  })
  //------------------------------

blogRoute.get('/:id',async  (c) => {
    
    const prsima = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    
    }).$extends(withAccelerate())

    const id =  c.req.param('id');

    const blog = await prsima.blog.findFirst({
        where : {
            id : id
        },
        
    })
    return c.json({mssg : blog})
  })
  
