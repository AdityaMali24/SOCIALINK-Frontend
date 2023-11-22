import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VerifiedIcon from "@mui/icons-material/Verified";
import DeleteIcon from "@mui/icons-material/Delete";

const GetPost =()=>{
    const userDetail = localStorage.getItem("userDetails");
  // console.log(userDetail);

  const [posts, setPosts] = useState([]);
  const [singleUser, setSingleUser] = useState([]);

  useEffect(()=>{
    const fetchSingleUser = async () => {
        const singleUser = await axios.get(
          `http://localhost:8007/user/get-single-user/${userDetail}`
        );
        // console.log(singleUser);
        if (singleUser.status === 200) {
          setSingleUser(singleUser.data.data);
          // console.log(singleUser.data.data);
        }
      };

      const fetchPosts = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8007/post/get-user-post/${userDetail}`
          );
          console.log(response);
          if (response.status === 200) {
            const sortedPosts = response.data.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
  
            setPosts(sortedPosts);
            console.log(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      fetchPosts();
      fetchSingleUser();

  }, [singleUser]);

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8007/post/delete-post/${postId}`
      );

      if (response.status === 200) {
        console.log("Post deleted successfully!");

        const updatedPosts = posts.filter((post) => post._id !== postId);
        setPosts(updatedPosts);
      } else {
        console.error("Error deleting the post:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:8007/post/like-post/${postId}`,
        {
          userID: userDetail,
        }
      );

      if (response.status === 200) {
        console.log("Post liked successfully!");

        // Update the post's like count
        const updatedPosts = posts.map((post) => {
          if (post._id === postId) {
            return { ...post, likes: [...post.likes, userDetail] };
          }
          return post;
        });

        setPosts(updatedPosts);
      } else {
        console.error("Error liking the post:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleUnlikePost = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:8007/post/unlike-post/${postId}`,
        {
          userID: userDetail,
        }
      );

      if (response.status === 200) {
        console.log("Post unliked successfully!");

        // Update the post's like count
        const updatedPosts = posts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: post.likes.filter((userId) => userId !== userDetail),
            };
          }
          return post;
        });

        setPosts(updatedPosts);
      } else {
        console.error("Error unliking the post:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <Box>
      {posts.map((post) => (
        <Paper
          key={post._id}
          sx={{
            padding: 2,
            marginBottom: 2,
            display: "flex",
            flexDirection: "column", // To stack the content vertically
            alignItems: "flex-start", // Align items to the left
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <Avatar>
              <img
                src={`http://localhost:8007/uploads/newFolder/${singleUser.ProfilePic}`}
                alt="a"
                className="img-fluid me-2"
              />
            </Avatar>
            <Typography variant="h6" component="div">
              {singleUser.username}
            </Typography>
          </div>
          <div className=" posttxt text-start">
            {post.content === "image" ? (
              <>
                <img
                  src={`http://localhost:8007/uploads/posts/${post.image}`}
                  alt="Post Image"
                  width={500}
                  height={300}
                  className="rounded my-3"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ marginTop: 8 }}
                >
                  {post.caption}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="">
                <p className="my-3">{post.textcontent}</p>
              </Typography>
            )}

            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-between align-items-center">
                  {post.likes.includes(userDetail) ? (
                    <button
                      className="bg-transparent"
                      onClick={() => handleUnlikePost(post._id)}
                    >
                      <FavoriteIcon className="text-danger me-1" />
                    </button>
                  ) : (
                    <button
                      className="bg-transparent"
                      onClick={() => handleLikePost(post._id)}
                    >
                      <FavoriteBorderIcon className="text-danger me-1" />
                    </button>
                  )}

                  {post.likes.length}
                </div>
              </div>
              <div>
                {post.userID === userDetail && (
                  <button
                    className="bg-transparent"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    <DeleteIcon className="text-danger" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Paper>
      ))}
    </Box>
  );

};

export default GetPost;