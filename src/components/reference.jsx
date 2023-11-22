import React from 'react'

const reference = () => {
  return (
    <div>reference</div>
  )
}

export default reference




import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import GifBoxIcon from "@mui/icons-material/GifBox";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import axios from "axios"; // Import Axios

export default function AddPost() {
  const [postContent, setPostContent] = useState("");
  const [contentType, setContentType] = useState("text");
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("userID", "user_id_here"); // Replace with the actual user ID
    formData.append("contentType", contentType);
    formData.append("textContent", postContent);

    if (contentType === "image" && imageFile) {
      formData.append("image", imageFile);
      formData.append("caption", caption);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/posts/add-post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        // Handle successful post creation
        console.log("Post created successfully!");
        // You can perform additional actions here, like updating the UI or redirecting to another page
      } else {
        // Handle error
        console.error("Error creating the post");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // Rest of your component code...

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        width: 1000,
        maxWidth: "100%",
      }}
    >
      <form onSubmit={handlePostSubmit}>
        {/* Rest of your component code... */}
      </form>
    </Box>
  );
}