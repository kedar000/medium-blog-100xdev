
import z from "zod";
export const signupZodCheck = z.object({
    email : z.string().email(),
    password : z.string().min(6),
    name : z.string().optional()
})

export const signinZodcheck = z.object({
    email : z.string().email(),
    password : z.string().min(6)
})


export const createBlogZodCheck = z.object({
    title : z.string(),
    content : z.string()
})

export const updateBlogZodCheck = z.object({
    title : z.string(),
    content : z.string(),
    id : z.string()
})

export type SignUptype = z.infer<typeof signupZodCheck>;
export type SignIntype = z.infer<typeof signinZodcheck>;
export type CreateBlogtype = z.infer<typeof createBlogZodCheck>;
export type UpdateBlogType = z.infer<typeof updateBlogZodCheck>;