import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import TextField from "@mui/material/TextField";
import axios from "axios";

const GetAllPost = () => {
  const [posts, setPosts] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const userDetail = localStorage.getItem("userDetails");
  const isLoggedIn = Boolean(userDetail);
  const [showComments, setShowComments] = useState({ postId: null });

  useEffect(() => {
    // Fetch posts from your API endpoint
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8007/post/get-all-posts"
        );
        // console.log(response);
        if (response.status === 200) {
          // Sort posts by creation date in descending order (latest to oldest)
          const sortedPosts = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPosts(sortedPosts);
          // console.log(sortedPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [posts]);

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

  // const onFollowHandler = (userid) => {
  //   const response = axios.put(
  //     `http://localhost:8007/user/follow-user/${userid}`,
  //     {
  //       userID: userDetail,
  //     }
  //   );

  //   if (response.status === 200) {
  //     console.log("User Followed");
  //   }
  // };

  const followUser = async (userid) => {
    const response = await axios.put(
      `http://localhost:8007/user/follow-user/${userid}`,
      {
        userID: userDetail,
      }
    );

    if (response.status === 200) {
      console.log("User Followed");
      // You may want to update the UI here to indicate that the user is now following.
    }
  };

  const unfollowUser = async (userid) => {
    const response = await axios.put(
      `http://localhost:8007/user/unfollow-user/${userid}`,
      {
        userID: userDetail,
      }
    );

    if (response.status === 200) {
      console.log("User Unfollowed");
      // You may want to update the UI here to indicate that the user is now unfollowing.
    }
  };

  const toggleHandler = (userid, post) => {
    const isFollowing = post?.users?.followers.includes(userDetail);
    if (!isFollowing) {
      followUser(userid);
    } else {
      unfollowUser(userid);
    }
  };

  const handleCommentChange = (event) => {
    setCommentInput(event.target.value);
    console.log("Comment Input:", event.target.value); // Add this line
  };

  const handleCommentSubmit = async (postId) => {
    try {
      console.log("Comment Input before API call:", commentInput); // Add this line
      console.log("User Detail:", userDetail); // Add this line

      const response = await axios.post(
        `http://localhost:8007/post/add-comment/${postId}`,
        {
          userID: userDetail,
          comment: commentInput,
        }
      );

      console.log("API Response:", response.data); // Add this line

      if (response.status === 200) {
        alert("Comment added successfully!");

        const updatedPosts = posts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: [
                ...post.comments,
                { user: { _id: userDetail }, comment: commentInput },
              ],
            };
          }
          return post;
        });


        console.log("Updated Posts:", updatedPosts); // Add this line

        setPosts(updatedPosts);
        setCommentInput("");
      } else {
        console.log("API Response:", response)
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const toggleComments = (postId) => {
    console.log("Toggling Comments for Post ID:", postId); // Add this line
    setShowComments((prevState) => ({
      ...prevState,
      postId: prevState.postId === postId ? null : postId,
    }));
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
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <Avatar>
              <img
                src={`http://localhost:8007/uploads/newFolder/${post.users.ProfilePic}`}
                alt="User Avatar"
                className="img-fluid me-2"
              />
            </Avatar>
            <Typography variant="h6" component="div">
              {post.users.username}
            </Typography>

            {post.users._id !== userDetail && (
              <button
                className="btn btn-primary py-0 fs-6 ms-2"
                onClick={() => toggleHandler(post.users._id, post)}
              >
                {post.users.followers.includes(userDetail)
                  ? "Unfollow"
                  : "Follow"}
              </button>
            )}
          </div>
          <div className="posttxt text-start">
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

            <div className="d-flex allbtn align-items-center justify-content-between">
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
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <button
                    className="bg-transparent"
                    onClick={() => toggleComments(post._id)}
                  >
                    <CommentIcon className="text-primary me-1" />
                    {showComments.postId === post._id
                      ? "Hide Comments"
                      : "Show Comments"}
                  </button>
                </div>
              </div>
              <div>
                {post.users._id === userDetail && (
                  <button
                    className="bg-transparent"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    <DeleteIcon className="text-danger" />
                  </button>
                )}
              </div>
            </div>
            {showComments.postId === post._id && (
              <div>
                {post.comments.map((comment, index) => {
                   console.log("Comment Data:", comment); // Add this line
                   return (
                  <div key={index}>
                    <Typography variant="body2" color="">
                      : {comment.comment}
                    </Typography>
                  </div>
                   );
                    })}
                <TextField
                  multiline
                  fullWidth
                  variant="outlined"
                  label="Add a Comment"
                  value={commentInput}
                  className="my-3"
                  onChange={handleCommentChange}
                />
                <button
                  className="bg-transparent"
                  onClick={() => handleCommentSubmit(post._id)}
                >
                  Submit Comment
                </button>
              </div>
            )}
          </div>
        </Paper>
      ))}
    </Box>
  );
};

export default GetAllPost;
