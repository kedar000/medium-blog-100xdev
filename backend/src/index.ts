import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

import { Hono } from 'hono'
import { sign , verify } from 'hono/jwt'
import { userRoute } from './routes/user'
import { blogRoute } from './routes/blog'

const app = new Hono<{
  Bindings : {
    DATABASE_URL : string,
    JWT_SECRET : string
  }
}>()



app.route('/api/v1/user' , userRoute);
app.route('/api/v1/blog' , blogRoute);


app.use('/api/v1/blog/*' ,async (c , next) =>{
  const header = c.req.header('Authorization') || "";

  // const token = header.split(" ")[1]
  const response = await verify(header , c.env.JWT_SECRET);
  if(response.id){
    next()
  }else{
    // c.status(404)
    return c.json({error : "unauthorized "})
  }

})




export default app
