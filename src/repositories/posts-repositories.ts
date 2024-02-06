import { postsCollection} from "./db";
import {ObjectId} from "mongodb";
import {BlogCreateType, BlogEntityType, BlogUpdateType, BlogViewType} from "../types/blog-type";
import {PostCreateType, PostEntityType, PostUpdateType, PostViewType} from "../types/post-type";
export const changeIdFormat = (obj: any) => {
    obj.id = obj._id
    delete obj._id
    delete obj.isMembership
    return obj
}


export const postsRepositories = {

    async getPosts() {
        const posts = await postsCollection.find({}).toArray();
        const fixArrayIds = posts.map((item => changeIdFormat(item)))
        if (fixArrayIds.length > 0) {
            return fixArrayIds
        } else {
            return []
        }
    },

    async getPostById(id: string| ObjectId): Promise<PostViewType | boolean> {
        const post: PostEntityType | null = await postsCollection.findOne({_id: new ObjectId(id)})
        console.log(post,'post')
        if (post) {
            let changedItem: PostViewType = changeIdFormat(post)
            return changedItem
        } else {
            return false
        }
    },

    async createPost(post:PostCreateType): Promise<boolean | ObjectId> {
        const response = await postsCollection.insertOne(post)
        console.log(response,'respomse')
        if (response.insertedId) {
            return response.insertedId
        } else {
            return false
        }
    },

    async updatePost(id:ObjectId, updatePost:PostUpdateType): Promise<boolean> {
        const response = await postsCollection.updateOne({_id: id}, {$set: updatePost})
        if (response.matchedCount === 1) {
            return true
        } else {
            return false
        }
    },


    async deletePost(id: ObjectId): Promise<boolean> {
        const response = await postsCollection.deleteOne({_id: id})
        if (response.deletedCount) {
            return true
        } else {
            return false
        }
    },

}