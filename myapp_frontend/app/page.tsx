"use client";

import { useEffect, useState } from "react";

interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const API_URL = "http://localhost:8000/api/blogs/";

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Add blog
  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title và Content không được để trống!");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error("Failed to add blog");
      const newBlog = await res.json();
      setBlogs(prev => [newBlog, ...prev]);
      setTitle("");
      setContent("");
      alert("Blog added successfully!");
    } catch (err) {
      console.error(err);
      alert("Add blog failed!");
    }
  };

  // Update blog
  const handleUpdate = async (id: number) => {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    const newTitle = prompt("Enter new title", blog.title);
    const newContent = prompt("Enter new content", blog.content);

    if (newTitle === null || newContent === null) return;

    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Update error:", errorData);
        alert("Update failed. Check console.");
        return;
      }

      const updatedBlog = await res.json();
      setBlogs(prev =>
        prev.map(b => (b.id === id ? { ...b, ...updatedBlog } : b))
      );
      alert(`Blog "${updatedBlog.title}" updated successfully!`);
    } catch (err) {
      console.error(err);
      alert("Update failed due to network error.");
    }
  };

  // Delete blog
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete blog");
      setBlogs(prev => prev.filter(b => b.id !== id));
      alert("Blog deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>My Blog</h1>

      {/* Form Add Blog */}
      <div style={{ marginBottom: "30px", background: "#f9f9f9", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "15px" }}>Add New Blog</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", padding: "10px", minHeight: "100px", borderRadius: "5px", border: "1px solid #ccc", marginBottom: "10px" }}
        />
        <button
          onClick={handleAdd}
          style={{ padding: "10px 20px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Add Blog
        </button>
      </div>

      {/* Blog List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {blogs.map((blog) => (
          <li
            key={blog.id}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>{blog.title}</h3>
            <p style={{ marginBottom: "15px", whiteSpace: "pre-wrap" }}>{blog.content}</p>
            <div>
              <button
                onClick={() => handleUpdate(blog.id)}
                style={{ marginRight: "10px", padding: "6px 12px", background: "#2196F3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog.id)}
                style={{ padding: "6px 12px", background: "#f44336", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
