
import { Hono } from 'hono'

const app = new Hono()


app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id')
  console.log(id);
  
  return c.text('get route ')
})

app.post('/api/v1/blog/signup', (c) => {
  return c.text('post signup route')
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
