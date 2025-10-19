import React, { useState, useEffect } from "react";
import useFetchData from "../hooks/useFetchData";

const Admin = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    price: "",
    stock: "",
    description: "",
    category_id: "",
  });

  const { data: categories } = useFetchData("http://localhost/finalexam/backend/api/get_categories.php");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (file) data.append("image", file);

    try {
      const res = await fetch("http://localhost/finalexam/backend/api/add_book.php", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      alert(result.message || "Book added successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add book.");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 flex flex-col items-center py-10"
    >
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[90%] max-w-3xl border border-pink-200">
        <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">
          🌸 Comic Store Admin
        </h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">✨ Add New Comic</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input type="text" name="title" placeholder="Enter title" onChange={handleChange} className="border rounded-md p-2" />
            <input type="text" name="author" placeholder="Enter author" onChange={handleChange} className="border rounded-md p-2" />
            <input type="text" name="genre" placeholder="Enter genre" onChange={handleChange} className="border rounded-md p-2" />
            <input type="number" name="price" placeholder="Enter price" onChange={handleChange} className="border rounded-md p-2" />
            <input type="number" name="stock" placeholder="Enter stock" onChange={handleChange} className="border rounded-md p-2" />
            <textarea name="description" placeholder="Enter description" onChange={handleChange} className="border rounded-md p-2"></textarea>

            <select name="category_id" onChange={handleChange} className="border rounded-md p-2">
              <option value="">Select Category</option>
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>

            <div className="flex items-center gap-3">
              <label className="font-medium text-gray-600">Comic Cover:</label>
              <input type="file" onChange={handleFileChange} className="text-sm" />
            </div>

            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg py-2 px-4 mt-3 transition-all"
            >
              🌸 Add Comic
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📚 Comic Collection</h2>
          <p className="text-gray-500 italic">Display of existing comics will go here.</p>
        </section>
      </div>

      <footer className="mt-10 text-sm text-gray-600">
        © 2025 <span className="text-pink-600 font-semibold">MangaMori Bookstore</span> — 物語はここから始まる。
      </footer>
    </div>
  );
};

export default Admin;
