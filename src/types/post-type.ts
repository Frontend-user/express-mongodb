import {ObjectId} from "mongodb";
import {BlogEntityType} from "./blog-type";
import exp from "constants";

export type PostEntityType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type  PostViewType = Omit<PostEntityType, '_id'> & {
    id: string
}
export type  PostCreateType = Omit<PostEntityType, '_id' >
export type PostUpdateType = Omit<PostEntityType, '_id'  | 'createdAt' | 'blogName'>