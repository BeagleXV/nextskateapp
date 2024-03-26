"use client"

import ReactMarkdown from "react-markdown"

import { MarkdownRenderers } from "@/app/upload/MarkdownRenderers"
import { usePostContext } from "@/contexts/PostContext"
import {
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react"
import Header from "../Post/Header"

import { useComments } from "@/hooks/comments"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import PostComment from "../Post/Comment"

interface PostModalInterface {
  isOpen: boolean
  onClose(): void
}

export function PostModal({ isOpen, onClose }: PostModalInterface) {
  const { post } = usePostContext()
  const { comments, isLoading, error } = useComments(post.author, post.permlink)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
      <ModalOverlay />
      <ModalContent
        bg={"black"}
        border={"1.4px solid limegreen"}
        borderRadius={32}
        p={4}
      >
        <ModalHeader>
          <Header />
        </ModalHeader>
        <ModalCloseButton mr={4} mt={2} color={"red"} />
        <ModalBody display={"flex"} minH={"60vh"} gap={6}>
          <Container
            bg={"black"}
            flex={1}
            p={4}
            border={"1.4px solid limegreen"}
            borderRadius="lg"
          >
            <ReactMarkdown
              components={MarkdownRenderers}
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
            >
              {post.body}
            </ReactMarkdown>
          </Container>
          <Container
            bg={"black"}
            flex={1}
            p={4}
            border={"1.4px solid limegreen"}
            borderRadius="lg"
            height={"fit-content"}
          >
            <Stack divider={<StackDivider borderColor={"limegreen"} />} gap={4}>
              {comments && comments.length > 1 ? (
                comments
                  .toReversed()
                  .map((comment, i) => (
                    <PostComment key={comment.id} comment={comment} />
                  ))
              ) : (
                <Text w={"100%"} align={"center"}>
                  Nothing yet
                </Text>
              )}
            </Stack>
          </Container>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PostModal
