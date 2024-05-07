import HiveClient from "@/lib/hive/hiveclient";
import { Discussion, DiscussionQueryCategory, DisqussionQuery } from "@hiveio/dhive";
import { useState, useEffect } from "react";

export default function usePosts(query: String, params: any[]) {
    const [posts, setPosts] = useState<Discussion[]>()
    const [queryCategory, setQueryCategory] = useState<String>(query)
    const [discussionQuery, setDiscussionQuery] = useState(params)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)



    useEffect(() => {
        const handleGetPosts = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const by = 'get_discussions_by_' + queryCategory
                const posts = await HiveClient.database.call(by, discussionQuery)
                console.log(posts, "posts")
                setPosts(posts)
            } catch (e) {
                console.log(e)
                setError("Loading account error!")
            } finally {
                setIsLoading(false)
            }
        }
        handleGetPosts()
    }, [queryCategory,discussionQuery]);
    return { posts, isLoading, error, queryCategory, setQueryCategory, setDiscussionQuery }
}


/*
import HiveClient from "@/lib/hiveclient"
import { Discussion } from "@hiveio/dhive"
import { useState } from "react"
import useSWR from "swr"

const SKATEHIVE_TAG = "hive-173115"
export const SWR_POSTS_TAG = "posts"
type QueryCategory = "created" | "trending"

async function fetchPosts(
  order: QueryCategory
): Promise<Discussion[] | undefined> {
  const posts = await HiveClient.database.getDiscussions(order, {
    tag: SKATEHIVE_TAG,
    limit: 100,
  })
  return posts
}

// Modificação para passar o argumento de ordenação
export function usePosts() {
  const [postType, setPostType] = useState<QueryCategory>("trending")

  const { data, error, isLoading } = useSWR([SWR_POSTS_TAG, postType], () =>
    fetchPosts(postType)
  )

  return {
    posts: data,
    error,
    isLoading,
    postType,
    setPostType,
  }
}
*/