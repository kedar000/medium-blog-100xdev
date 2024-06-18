import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'

const app = new Hono<{
  Bindings : {
    DATABASE_URL : string
  }
}>()


app.post('/api/v1/blog/signup', async (c) => {

const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const body = await c.req.json();

await prisma.user.create({
  data : {
    email : body.email,
    password : body.password
  },
})


  return c.text('post signup route')
})

app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id')
  console.log(id);
  
  return c.text('get route ')
})

app.post('/api/v1/blog/signin', (c) => {
  return c.text('post signinn route!')
})

app.post('/api/v1/blog/blog', (c) => {
  return c.text('post blog route!')
})

app.put('/api/v1/blog/blog', (c) => {
  return c.text('put route!')
})
export default app
