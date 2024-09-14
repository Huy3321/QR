import React, { useState, useEffect, Fragment } from "react";
import "./category.css";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import ConfirmDialog from "../../admin_components/confirm_dialog/confirm_dialog";
function Category() {
  const [categoryName, setCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const authHeader = useAuthHeader();
  const [reload, setReload] = useState(false);

  const config = {
    headers: { Authorization: authHeader },
  };

  useEffect(() => {
    // Define the async function to fetch data
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/category/all`
        );
        if (response.data.status === 200) {
          setCategories(response.data.listCategories); // Assuming response.data contains the categories
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories(); // Call the function to fetch data
  }, [reload]);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReset = () => {
    setCategoryName("");
    setIsEditing(false);
    setEditCategoryName("");
    setEditCategoryId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEditing) {
      // Handling updating category
      const url = `${process.env.REACT_APP_API_URL}/v1/category/${editCategoryId}`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      };
      const data = { name: editCategoryName };

      axios
        .put(url, data, config)
        .then((response) => {
          if (response.status === 200) {
            alert(`Tên danh mục được đổi thành ${editCategoryName}`);
            setReload(!reload);
          } else {
            alert("Xảy ra lỗi khi đổi tên danh mục");
          }
        })
        .catch((error) => {
          alert("Xảy ra lỗi khi đổi tên danh mục");
          console.error("Error updating category:", error);
        });
    } else {
      // Handling creating a new category
      const url = `${process.env.REACT_APP_API_URL}/v1/category`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      };
      const data = { name: categoryName };

      axios
        .post(url, data, config)
        .then((response) => {
          if (response.status === 200) {
            alert(`Tạo danh mục ${categoryName} thành công!`);
            setReload(!reload);
          } else {
            alert("Xảy ra lỗi khi tạo danh mục! Có thể danh mục đã tồn tại");
          }
        })
        .catch((error) => {
          alert("Xảy ra lỗi khi tạo danh mục! Có thể danh mục đã tồn tại");
          console.error("Error creating category:", error);
        });
    }
    handleReset();
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setEditCategoryName(category.name);
    setEditCategoryId(category.id);
  };

  const handleDeleteCategory = (category) => {
    const url = `${process.env.REACT_APP_API_URL}/v1/category/${category.id}`;
    const config = {
      headers: {
        Authorization: authHeader,
      },
    };

    axios
      .delete(url, config)
      .then((response) => {
        if (response.status === 200) {
          alert(`Xoá danh mục ${category.name} thành công.`);
          setReload(!reload);
        } else {
          alert("Xảy ra lỗi khi xoá danh mục");
        }
      })
      .catch((error) => {
        alert("Xảy ra lỗi khi xoá danh mục");
        console.error("Error deleting category:", error);
      });
  };

  const confirmDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setConfirmDelete(true);
  };

  const handleCancel = () => {
    setConfirmDelete(false);
    setCategoryToDelete(null);
  };

  const handleConfirm = () => {
    if (categoryToDelete) {
      handleDeleteCategory(categoryToDelete);
    }
    handleCancel(); // Close dialog after confirming deletion
  };

  return (
    <Fragment>
      {confirmDelete && (
        <ConfirmDialog
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        >
          Nếu xoá bỏ danh mục <strong>{categoryToDelete.name}</strong> thì các
          sản phẩm thuộc danh mục này cũng sẽ bị xoá. Bạn muốn tiếp tục?
        </ConfirmDialog>
      )}
      {!isEditing ? (
        <div className="create-category-container">
          <h1 className="create-category-title">Tạo danh mục mới</h1>
          <form className="create-category-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="categoryName">Tên danh mục mới</label>
              <input
                type="text"
                id="categoryName"
                placeholder="Danh mục"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="reset-button"
                onClick={handleReset}
              >
                Đặt lại
              </button>
              <button type="submit" className="submit-button">
                Tạo danh mục mới
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="create-category-container">
          <h1 className="create-category-title">Sửa danh mục</h1>
          <form className="create-category-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="editCategoryName">Tên danh mục</label>
              <input
                type="text"
                id="editCategoryName"
                placeholder="Category"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
              />
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="reset-button"
                onClick={handleReset}
              >
                Huỷ bỏ
              </button>
              <button type="submit" className="submit-button">
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="category-table-container">
        <div className="category-table-header">
          <h1 className="category-table-title">Toàn bộ danh mục</h1>
          <div className="category-search">
            <input
              type="text"
              placeholder="Tìm danh mục bằng tên"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">Tìm kiếm</button>
          </div>
        </div>
        <table className="category-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Sửa</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category, index) => (
              <tr key={category.id}>
                <td>{index + 1}</td>
                <td>{category.name}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(category)}
                  >
                    Sửa
                  </button>
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => confirmDeleteCategory(category)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default Category;
