import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState();
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:8000/api/posts");
    setPosts(res.data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    const res = await axios.post("http://localhost:8000/api/post", formData);
    if (res.status === 200) {
      fetchPosts();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (id) => {
    const response = await axios.delete(`http://localhost:8000/api/post/${id}`);
    if (response.status === 200) {
      fetchPosts();
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <form
        onSubmit={handleUpload}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="file"
          placeholder="upload file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="caption"
          required
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button>Upload</button>
      </form>

      {/* images section */}
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            display: "flex",
            marginTop: "10px",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <img
            src={post.url}
            alt={post.caption}
            style={{ maxHeight: "400px" }}
          />
          <button onClick={() => deletePost(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
