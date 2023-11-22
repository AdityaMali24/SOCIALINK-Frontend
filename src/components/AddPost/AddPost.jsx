import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import GifBoxIcon from "@mui/icons-material/GifBox";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useState } from "react";
import axios from "axios";

export default function AddPost() {
  const userDetail = localStorage.getItem("userDetails");
  console.log(userDetail);

  const [textcontent, setTextContent] = useState("");
  const [content, setContent] = useState("text");
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [postCreated, setPostCreated] = useState(false); // Track post creation status

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setContent("image");
    } else {
      setContent("text");
    }
    setImageFile(e.target.files[0]);
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");
    console.log("textcontent:", textcontent);
    console.log("content:", content);
    console.log("imageFile:", imageFile);
    console.log("caption:", caption);

    const formData = new FormData();
    formData.append("userID", userDetail);
    formData.append("content", content);
    formData.append("textcontent", textcontent);

    if (content === "image" && imageFile) {
      formData.append("image", imageFile);
      formData.append("caption", caption);
    }

    try {
      const response = await axios.post(
        "http://localhost:8007/post/add-post",
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
        setPostCreated(true); // Update the state to indicate success
        // Clear the form fields and reset to the default state
        setTextContent("");
        setContent("text");
        setImageFile(null);
        setCaption("");
        setTimeout(() => {
          // Reset the success message after a delay
          setPostCreated(false);
        }, 3000); // Reset after 3 seconds (adjust as needed)
      } else {
        // Handle error
        console.error("Error creating the post");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

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
      {postCreated ? (
        <div>Post created successfully!</div>
      ) : (
        <form onSubmit={handlePostSubmit}>
          {/* Rest of your component code... */}
          <TextField
            fullWidth
            label="What's Happening?"
            id="fullWidth"
            value={textcontent}
            onChange={(e) => {
              setTextContent(e.target.value);
              console.log("Updated textcontent:", e.target.value);
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              "& > *": {
                m: 1,
              },
            }}
          >
            {content === "text" ? null : (
              <ButtonGroup variant="text" aria-label="text button group">
                <Button onClick={() => setContent("text")}>Text</Button>
              </ButtonGroup>
            )}
            <ButtonGroup variant="text" aria-label="content type button group">
              <Button onClick={() => setContent("image")}>
                <AddPhotoAlternateIcon />
              </Button>
              <Button>
                <EmojiEmotionsIcon />
              </Button>
            </ButtonGroup>
            {content === "image" && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <TextField
                  fullWidth
                  label="Caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
            )}
            <Button type="submit" variant="contained" className="post-btn">
              Post
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}


