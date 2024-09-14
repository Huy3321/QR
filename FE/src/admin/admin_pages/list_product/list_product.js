import React, { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";
import "./ListProduct.css";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Pagination from "../../admin_components/pagination/pagination";
function ListProduct() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortPrice, setSortPrice] = useState("DESC"); // 'ASC' for ASCending, 'DESC' for DESCending, null for no sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [productCategoryId, setProductCategoryId] = useState("");

  const authHeader = useAuthHeader();
  //for edit product
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [newProductImage, setNewProductImage] = useState(null); // New state to store new image
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery, sortPrice]);

  const fetchProducts = async () => {
    setLoading(true);

    // Initialize an object for parameters
    const params = {
      page: currentPage,
      pageSize: 10,
    };

    // Conditionally add parameters only if they have a value
    if (searchQuery) {
      params.search = searchQuery;
    }
    if (sortPrice) {
      params.priceOrder = sortPrice;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/v1/dish/searchDishes`,
        { params }
      );

      if (response.data.status === 200) {
        setProducts(response.data.data.dishes);
        setTotalPages(response.data.data.pagesNumber);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const toggleSortPrice = () => {
    if (sortPrice === "ASC") {
      setSortPrice("DESC");
    } else {
      setSortPrice("ASC");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setProductName(product.name);
    setProductPrice(product.price);
    setProductDescription(product.description);
    setProductCategoryId(product.category_id);
    setProductQuantity(product.quantity);
    setProductImage(product.image); // Store current image
    setNewProductImage(null); // Reset new image
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // You might want to fetch new data based on the selected page here
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileType = file.type;
      const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (!validImageTypes.includes(fileType)) {
        alert("Chỉ chấp nhận ảnh có định dạng PNG, JPG, JPEG.");
        setNewProductImage(null);
        fileInputRef.current.value = ""; // Clear the file input
        return;
      }

      setNewProductImage(file); // Store new image
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    // Create a FormData object for the API call
    const formData = new FormData();

    // Check if fields have changed from their initial values and add them to FormData
    if (productName !== editingProduct.name) {
      formData.append("name", productName);
    }

    if (productPrice !== editingProduct.price) {
      formData.append("price", productPrice);
    }

    if (productDescription !== editingProduct.description) {
      formData.append("description", productDescription);
    }

    //  KIỂM tra lại lỗi ko có category
    if (productCategoryId !== editingProduct.category_id) {
      formData.append("category_id", productCategoryId);
    }

    if (productQuantity !== editingProduct.quantity) {
      formData.append("quantity", productQuantity);
    }

    if (newProductImage != null) {
      formData.append("image", newProductImage);
    }

    // If no fields have changed, notify the user and exit
    if (
      !formData.has("name") &&
      !formData.has("price") &&
      !formData.has("description") &&
      !formData.has("category_id") &&
      !formData.has("quantity") &&
      !formData.has("image")
    ) {
      alert("Không có thay đổi nào để cập nhật.");
      handleCancelEdit();
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/v1/dish?id=${editingProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authHeader, // Replace with your actual token
          },
        }
      );

      if (response.data.status === 200) {
        alert("Cập nhật sản phẩm thành công.");
        fetchProducts(); // Refresh the product list
        handleCancelEdit(); // Reset form and exit edit mode
      } else {
        alert("Failed to update product.");
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred while updating the product.");
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setProductName("");
    setProductPrice("");
    setProductDescription("");
    setProductQuantity("");
    setProductImage(null);
    setNewProductImage(null); // Reset new image
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  };

  return (
    <Fragment>
      {isEditing && (
        <div className="edit-product-container">
          <form className="edit-product-form" onSubmit={handleUpdateProduct}>
            <div className="edit-left-side">
              <div className="form-group">
                <label htmlFor="editProductName">Tên sản phẩm</label>
                <input
                  type="text"
                  id="editProductName"
                  placeholder="Tên sản phẩm"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editProductPrice">Giá</label>
                <input
                  type="text"
                  id="editProductPrice"
                  placeholder="Giá"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editProductDescription">Mô tả</label>
                <input
                  type="text"
                  id="editProductDescription"
                  placeholder="Mô tả"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editProductCategoryId">Danh mục</label>
                <select
                  id="editProductCategoryId"
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
                <label htmlFor="editProductQuantity">Số lượng</label>
                <input
                  type="text"
                  id="editProductQuantity"
                  placeholder="Số lượng"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                />
              </div>
            </div>
            <div className="edit-right-side">
              <div className="form-group">
                <label htmlFor="editProductImage">Chọn hình ảnh</label>
                <input
                  type="file"
                  id="editProductImage"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/jpg"
                />
              </div>
              <div className="edit-image-previews">
                {productImage && !newProductImage && (
                  <div className="edit-image-preview">
                    <p>Ảnh hiện tại:</p>
                    <img src={productImage} alt="Current" />
                  </div>
                )}
                {newProductImage && (
                  <div className="edit-image-preview">
                    <p>Ảnh mới:</p>
                    <img src={URL.createObjectURL(newProductImage)} alt="New" />
                  </div>
                )}
              </div>
              <div className="edit-form-buttons">
                <button
                  type="button"
                  className="edit-reset-button"
                  onClick={handleCancelEdit}
                >
                  Huỷ bỏ
                </button>
                <button type="submit" className="edit-submit-button">
                  Lưu
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="list-product-container">
        <div className="list-product-header">
          <h2 className="header-title">Danh sách sản phẩm</h2>
          <div className="header-controls">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button className="sort-button" onClick={toggleSortPrice}>
              Sắp xếp theo giá {sortPrice === "ASC" ? "↑" : "↓"}
            </button>
          </div>
        </div>
        <table className="product-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ảnh</th> {/* Thêm tiêu đề cột cho ảnh */}
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Mô tả</th>
              <th>Số lượng</th>
              <th>Sửa thông tin</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1 + (currentPage - 1) * 10}</td>
                <td>
                  <img src={product.image} alt="Product" /> {/* Hiển thị ảnh */}
                </td>
                <td>{product.name}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.description}</td>
                <td>{product.quantity}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEditProduct(product)}
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Your other code here */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </Fragment>
  );
}

export default ListProduct;
