"use client"

import { useHiveUser } from '@/contexts/UserContext';
import { useComments } from '@/hooks/comments';
import { Box, Center, Divider, Flex, Heading, Image, Text, useBreakpointValue } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import React, { useMemo, useState } from 'react';
import EmbeddedCommentList, { EmbeddedCommentListProps } from './EmbeddedCommentList';
import UploadForm from './UploadForm';
import Head from "next/head";

const EmbeddedMap: React.FC = () => {
  const parent_author = "web-gnar";
  const parent_permlink = "about-the-skatehive-spotbook";
  const mapSrc = "https://www.google.com/maps/d/u/1/embed?mid=1iiXzotKL-uJ3l7USddpTDvadGII&hl=en&ll=29.208380630280647%2C-100.5437214508988&z=4";
  const { comments: allComments, addComment, isLoading } = useComments(parent_author, parent_permlink);
  const user = useHiveUser();
  const username = user?.hiveUser?.name || 'Anonymous';
  const boxWidth = useBreakpointValue({ base: "90%", sm: "80%", md: "75%", lg: "70%" });
  const paddingX = useBreakpointValue({ base: 2, sm: 4, md: 6 });
  const paddingY = useBreakpointValue({ base: 2, sm: 4 });
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [sortMethod, setSortMethod] = useState<string>("chronological");
  const [visiblePosts, setVisiblePosts] = useState<number>(10);

  const comments = useMemo(() => {
    return allComments.filter(comment => comment.parent_permlink === parent_permlink);
  }, [allComments, parent_permlink]);

  const sortedComments = useMemo(() => {
    if (sortMethod === "chronological") {
      return comments?.slice().reverse();
    } else if (sortMethod === "engagement") {
      return comments?.slice().sort((a, b) => (b?.children ?? 0) - (a?.children ?? 0));
    }
    return comments;
  }, [comments, sortMethod]);

  const embeddedCommentListProps: EmbeddedCommentListProps = {
    comments: sortedComments || [],
    visiblePosts: visiblePosts,
    username: username,
    parentPermlink: parent_permlink,
  };

  return (
    <>
      <Global
        styles={`
          @property --a {
            syntax: "<angle>";
            inherits: false;
            initial-value: 135deg;
          }

          @keyframes bgrotate {
            from {
              --a: 135deg;
            }
            to {
              --a: 315deg;
            }
          }

          #animatedBox {
            background-image: repeating-linear-gradient(var(--a), #198e2b, #7b9565 10vw);
            animation-name: bgrotate;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            animation-duration: 30s;
          }
        `}
      />
      <Flex
        flexDirection="column"
        align="center"
        justifyContent="center"
        p={4}
        style={{ width: isMobile ? "auto" : "70%" }}
        maxWidth="100%"

      >
        <Box
          id="animatedBox"
          borderRadius="10px"
          p={{ base: 2, md: 4 }}
          width="boxWidth"
          maxWidth="100%"
          mx="auto"
          mb={6}
          boxShadow="xl"
        >
          <Head>
            <title>Skatehive Spot Map - A Global Skatespot Database</title>
            <meta name="description" content="Discover the Skatehive Spot Map, a global database for finding and sharing skate spots. Join the community today!" />
            <meta name="keywords" content="skateboarding, skate spots, skate map, global skate spots, skatehive" />
          </Head>
          <Heading as="h1" fontSize="4xl" fontWeight="bold" color="white" mb={2} textAlign="center">
            Skatehive Spot Map
          </Heading>
          <Text fontSize="lg" fontWeight="bold" color="white" mb={2} textAlign="center" paddingBottom={5}>
            A Global Skatespot Database
          </Text>
          <Box mb={4}>
            <iframe
              src={mapSrc}

              style={{
                border: "0",


                height: isMobile ? "50vh" : "500px",

                width: "90%",
                padding: 0,

               
                margin: "auto",
                left: 0,
                top: 0,
                touchAction: "pan-x pan-y",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
              }}

              allowFullScreen
            ></iframe>
          </Box>
          <Flex flexDirection={{ base: "column", md: "row" }} align="center">
            <Box flex="1" display={{ base: "none", md: "block" }} mx="auto">
              <Image
                src="https://i.ibb.co/yqr3KQR/image.png"
                alt="Map thumbnail"
                boxSize="250px"
                boxShadow="md"
                margin="10%"
              />
            </Box>
            <Box flex="2" p={paddingX} bg="black"
            
            >
              <Text fontSize="large" color="white" mb={3}>
                This skatespot database started in 2012. The <Box as="span" color="blue.600">dark blue</Box> pins are street spots. The <Box as="span" color="teal.300">light blue</Box> pins are skateparks. 
              </Text>
              <Text fontSize="large" color="white" mb={3}>
                If you would like to add a spot, upload a photo of the spot below. When a mod approves your photo, it will be added to the spotbook. Some tips on submitting a spot:
              </Text>
           
              <Text fontSize="large" color="white" mb={3}>
              Take a photo of the spot. Try not to include people in the photo.

              Find the coordinates of the spot. Latitude, then Longitude. Bake the GPS coordinates into the photo by turning location services on with Photos on your phone.
  
              Login and submit the spot.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box width={boxWidth} color="white">
          
          <UploadForm />
        </Box>
        <Divider mt={12}/>
        <Box width={boxWidth} mt={6}>
          <EmbeddedCommentList {...embeddedCommentListProps} />
        </Box>
      </Flex>
    </>
  );
};

export default EmbeddedMap;
