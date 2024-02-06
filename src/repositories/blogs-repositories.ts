import {blogsCollection, client} from "./db";
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
        if (fixArrayIds.length > 0) {
            return fixArrayIds
        } else {
            return []
        }
    },

    async getBlogById(id: string| ObjectId): Promise<BlogViewType | boolean> {
        const blog: BlogEntityType | null = await blogsCollection.findOne({_id: new ObjectId(id)})
        if (blog) {
            let changedItem: BlogViewType = changeIdFormat(blog)
            return changedItem
        } else {
            return false
        }
    },

    async createBlog(blog: BlogCreateType): Promise<boolean | ObjectId> {
        const response = await blogsCollection.insertOne(blog)
        console.log(response,'respomse')
        if (response.insertedId) {
            return response.insertedId
        } else {
            return false
        }
    },

    async updateBlog(id:ObjectId, updateBlog:BlogUpdateType): Promise<boolean> {
        const response = await blogsCollection.updateOne({_id: id}, {$set: updateBlog})
        if (response.matchedCount === 1) {
            return true
        } else {
            return false
        }
    },


    async deleteBlog(id: ObjectId): Promise<boolean> {
        const response = await blogsCollection.deleteOne({_id: id})
        if (response.deletedCount) {
            return true
        } else {
            return false
        }
    },

}