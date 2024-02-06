import {blogsCollection} from "./db";
import {ObjectId} from "mongodb";
import {BlogCreateType, BlogEntityType, BlogUpdateType, BlogViewType} from "../types/blog-type";

export const changeIdFormat = (obj: any) => {
    obj.id = obj._id
    delete obj._id
    return obj
}


export const blogsRepositories = {

    async getBlogs() {
        const blogs = await blogsCollection.find({}).toArray();
        const fixArrayIds = blogs.map((item => changeIdFormat(item)))
        return fixArrayIds.length > 0 ? fixArrayIds : []
    },

    async getBlogById(id: string | ObjectId): Promise<BlogViewType | boolean> {
        const blog: BlogEntityType | null = await blogsCollection.findOne({_id: new ObjectId(id)})
        return blog ? changeIdFormat(blog) : false
    },

    async createBlog(blog: BlogCreateType): Promise<false | ObjectId> {
        const response = await blogsCollection.insertOne(blog)
        return response ? response.insertedId : false
    },

    async updateBlog(id: ObjectId, updateBlog: BlogUpdateType): Promise<boolean> {
        const response = await blogsCollection.updateOne({_id: id}, {$set: updateBlog})
        return response.matchedCount === 1;
    },


    async deleteBlog(id: ObjectId): Promise<boolean> {
        const response = await blogsCollection.deleteOne({_id: id})
        return !!response.deletedCount;
    },

}