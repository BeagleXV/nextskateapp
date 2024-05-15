import HiveClient from "@/lib/hive/hiveclient"
import { useEffect, useState } from "react"

export interface Comment {
  abs_rshares?: number
  active_votes?: ActiveVote[]
  allow_curation_rewards?: boolean
  allow_replies?: boolean
  allow_votes?: boolean
  author: string
  author_reputation?: number
  author_rewards?: number
  beneficiaries?: any[]
  body: string
  body_length?: number
  cashout_time?: string
  category?: string
  children?: number
  children_abs_rshares?: number
  created?: string
  curator_payout_value?: string
  depth?: number
  id?: number
  json_metadata: string
  last_payout?: string
  last_update?: string
  max_accepted_payout?: string
  max_cashout_time?: string
  net_rshares?: number
  net_votes?: number
  parent_author: string
  parent_permlink: string
  pending_payout_value?: string
  percent_hbd?: number
  permlink: string
  promoted?: string
  reblogged_by?: any[]
  replies?: Comment[]
  reward_weight?: number
  root_author?: string
  root_permlink?: string
  root_title?: string
  title: string
  total_payout_value?: string
  total_pending_payout_value?: string
  total_vote_weight?: number
  url?: string
  vote_rshares?: number
}

export interface ActiveVote {
  percent: number
  reputation: number
  rshares: number
  time: string
  voter: string
  weight: number
}

export async function fetchComments(
  author: string,
  permlink: string
): Promise<Comment[]> {
  try {
    const comments = await HiveClient.database.call("get_content_replies", [author, permlink]) as Comment[];
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        if (comment.children && comment.children > 0) {
          comment.replies = await fetchComments(comment.author, comment.permlink);
        }
        return comment;
      })
    );
    return commentsWithReplies;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }
}

export function useComments(author: string, permlink: string) {
  const [comments, setComments] = useState<Comment[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let isMounted = true; // Initialize isMounted to true

    const fetchAndUpdateComments = async () => {
      try {
        const fetchedComments = await fetchComments(author, permlink);
        if (isMounted) {
          setComments(fetchedComments);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message ? err.message : "Error loading comments");
        }
      }
    };

    fetchAndUpdateComments(); // Call the async function

    return () => {
      isMounted = false; // Ensure cleanup is called when the component unmounts
    };
  }, [author, permlink]); // Depend only on author and permlink

  const addComment = (newComment: Comment) => {
    setComments((existingComments) => existingComments ? [...existingComments, newComment] : [newComment]);
  };

  return {
    comments,
    error,
    isLoading,
    addComment,
    updateComments: fetchComments // Expose the method for manual updates
  };
}
