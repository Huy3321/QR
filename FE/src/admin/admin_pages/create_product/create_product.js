import React, { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";

import "./CreateProduct.css";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

function CreateProduct() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const authHeader = useAuthHeader();
  const fileInputRef = useRef(null);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/category/all`
        );
        if (response.data.status === 200) {
          setCategories(response.data.listCategories);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileType = file.type;
      const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (!validImageTypes.includes(fileType)) {
        alert("Chỉ chấp nhận ảnh có định dạng PNG, JPG, JPEG.");
        setProductImage(null);
        fileInputRef.current.value = ""; // Clear the file input
        return;
      }

      setProductImage(file);
    }
  };

  const handleReset = () => {
    setProductName("");
    setProductPrice("");
    setProductDescription("");
    setProductCategoryId("");
    setProductQuantity("");
    setProductImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !productCategoryId || !productImage) {
      alert("Hãy điền đầy đủ thông tin");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("description", productDescription);
    formData.append("category_id", productCategoryId);
    formData.append("quantity", productQuantity);
    formData.append("image", productImage);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/dish`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authHeader, // Use the auth header from react-auth-kit
          },
        }
      );

      if (response.data.status === 200) {
        alert("Tạo sản phẩm thành công.");
        handleReset(); // Reset form after successful creation
      } else {
        alert("Failed to create product.");
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred while creating the product.");
    }
  };

  return (
    <Fragment>
      <div className="create-product-container">
        <form className="create-product-form" onSubmit={handleSubmit}>
          <div className="left-side">
            <div className="form-group">
              <label htmlFor="productName">Tên sản phẩm</label>
              <input
                type="text"
                id="productName"
                placeholder="Tên sản phẩm"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="productPrice">Giá</label>
              <input
                type="text"
                id="productPrice"
                placeholder="Giá"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="productDescription">Mô tả</label>
              <input
                type="text"
                id="productDescription"
                placeholder="Mô tả"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="productCategoryId">Danh mục</label>
              <select
                id="productCategoryId"
                value={productCategoryId}
                onChange={(e) => setProductCategoryId(e.target.value)}
              >
                <option value="" disabled>
                  Chọn danh mục
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="productQuantity">Số lượng</label>
              <input
                type="text"
                id="productQuantity"
                placeholder="Số lượng"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
              />
            </div>
          </div>
          <div className="right-side">
            <div className="form-group">
              <label htmlFor="productImage">Chọn hình ảnh</label>
              <input
                type="file"
                id="productImage"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            {productImage && (
              <div className="image-preview">
                <img src={URL.createObjectURL(productImage)} alt="Preview" />
              </div>
            )}
            <div className="form-buttons">
              <button
                type="button"
                className="reset-button"
                onClick={handleReset}
              >
                Đặt lại
              </button>
              <button type="submit" className="submit-button">
                Xác nhận
              </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default CreateProduct;
