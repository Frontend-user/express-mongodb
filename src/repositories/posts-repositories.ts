import {postsCollection} from "./db";
import {ObjectId} from "mongodb";
import {PostCreateType, PostEntityType, PostUpdateType, PostViewType} from "../types/post-type";

const changeIdFormat = (obj: any) => {
    console.log(obj,'obj')
    obj.id = obj._id
    delete obj._id
    console.log(obj,'obj After dELETE')

    return obj
}


export const postsRepositories = {

    async getPosts() {
        const posts:PostEntityType[] = await postsCollection.find({}).toArray();
        const fixArrayIds:PostViewType[] = posts.map((item => changeIdFormat(item)))
        return fixArrayIds.length > 0 ? fixArrayIds:  []
    },

    async getPostById(id: string| ObjectId): Promise<PostViewType | boolean> {
        const post: PostEntityType | null = await postsCollection.findOne({_id: new ObjectId(id)})
        return post ? changeIdFormat(post): false
    },

    async createPost(post:PostCreateType): Promise<boolean | ObjectId> {
        const response = await postsCollection.insertOne(post)
        return response.insertedId ? response.insertedId: false
    },

    async updatePost(id:ObjectId, updatePost:PostUpdateType): Promise<boolean> {
        const response = await postsCollection.updateOne({_id: id}, {$set: updatePost})
        return response.matchedCount === 1;
    },


    async deletePost(id: ObjectId): Promise<boolean> {
        const response = await postsCollection.deleteOne({_id: id})
        return !!response.deletedCount;
    },

}