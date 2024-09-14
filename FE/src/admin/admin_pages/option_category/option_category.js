import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import "./OptionCategory.css";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

function OptionCategory() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [options, setOptions] = useState([]);
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionPrice, setNewOptionPrice] = useState("");
  const [editOptionName, setEditOptionName] = useState("");
  const [editOptionPrice, setEditOptionPrice] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editOptionId, setEditOptionId] = useState(null);
  const [reload, setReload] = useState(false);

  const authHeader = useAuthHeader();

  useEffect(() => {
    // Fetch categories when the component mounts
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

  useEffect(() => {
    // Fetch options whenever the selected category changes
    const fetchOptions = async () => {
      if (!selectedCategory) return;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/option?category_id=${selectedCategory}`
        );
        if (response.data.status === 200) {
          setOptions(response.data.data);
          // setOptions(response.data.options); // Assuming the response has an options array
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchOptions();
  }, [selectedCategory, reload]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleNewOptionChange = (event) => {
    setNewOptionName(event.target.value);
  };

  const handleNewOptionPriceChange = (event) => {
    setNewOptionPrice(event.target.value);
  };

  const handleEditOptionChange = (event) => {
    setEditOptionName(event.target.value);
  };

  const handleEditOptionPriceChange = (event) => {
    setEditOptionPrice(event.target.value);
  };

  const createNewOption = async (e) => {
    e.preventDefault();
    if (!newOptionName || !newOptionPrice || !selectedCategory) {
      alert("Please enter all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/option`,
        {
          name: newOptionName,
          price: newOptionPrice,
          category_id: selectedCategory,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader, // Replace with your actual token
          },
        }
      );

      if (response.data.status === 200) {
        alert("Tạo tuỳ chọn thành công.");
        setNewOptionName("");
        setNewOptionPrice("");
        setReload(!reload); // Trigger a reload to fetch updated options
      } else {
        alert("Failed to create option.");
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred while creating the option.");
    }
  };

  const handleEditClick = (option) => {
    setIsEditing(true);
    setEditOptionId(option.id);
    setEditOptionName(option.name);
    setEditOptionPrice(option.price);
  };

  const handleReset = () => {
    setIsEditing(false);
    setEditOptionId(null);
    setEditOptionName("");
    setEditOptionPrice("");
    setNewOptionName("");
    setNewOptionPrice("");
  };

  const editOption = async (e) => {
    e.preventDefault();

    if (!editOptionName || !editOptionPrice) {
      alert("Please enter all required fields.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/v1/option/${editOptionId}`, // URL from cURL command
        {
          name: editOptionName,
          price: editOptionPrice,
        },
        {
          headers: {
            // Accept: "application/json, text/plain, */*",
            Authorization: authHeader, // Replace with actual token
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 202) {
        alert("Cập nhật tuỳ chọn thành công.");
        handleReset(); // Reset the form after editing
        setReload(!reload); // Trigger a reload to fetch updated options
      } else {
        alert("Failed to update option.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the option.");
    }
  };

  const handleDeleteOption = async (option) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/v1/option/${option.id}`,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            Authorization: authHeader, // Replace with actual token
          },
        }
      );

      if (response.data.status === 202) {
        alert("Xoá thành công.");
        setReload(!reload); // Trigger a reload to fetch updated options
      } else {
        alert("Failed to delete option.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the option.");
    }
  };
  return (
    <Fragment>
      <div className="option-category-container">
        <h2>Hãy chọn danh mục để tiếp tục</h2>
        <div className="dropdown-container">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-dropdown"
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
      </div>
      {selectedCategory && (
        <>
          {!isEditing ? (
            <div className="create-option-container">
              <h1 className="create-option-title">Tạo tùy chọn mới</h1>
              <form className="create-option-form" onSubmit={createNewOption}>
                <div className="form-group">
                  <label htmlFor="newOptionName">Tên tùy chọn mới</label>
                  <input
                    type="text"
                    id="newOptionName"
                    placeholder="Tùy chọn"
                    value={newOptionName}
                    onChange={handleNewOptionChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newOptionPrice">Giá tùy chọn mới</label>
                  <input
                    type="text"
                    id="newOptionPrice"
                    placeholder="Giá"
                    value={newOptionPrice}
                    onChange={handleNewOptionPriceChange}
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
                    Tạo tùy chọn mới
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="create-option-container">
              <h1 className="create-option-title">Sửa tùy chọn</h1>
              <form className="create-option-form" onSubmit={editOption}>
                <div className="form-group">
                  <label htmlFor="editOptionName">Tên tùy chọn</label>
                  <input
                    type="text"
                    id="editOptionName"
                    placeholder="Tùy chọn"
                    value={editOptionName}
                    onChange={handleEditOptionChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="editOptionPrice">Giá tùy chọn</label>
                  <input
                    type="text"
                    id="editOptionPrice"
                    placeholder="Giá"
                    value={editOptionPrice}
                    onChange={handleEditOptionPriceChange}
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

          <div className="options-table-container">
            <table className="options-table">
              <thead>
                <tr>
                  <th>Tên tùy chọn</th>
                  <th>Giá</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {options.map((option) => (
                  <tr key={option.id}>
                    <td>{option.name}</td>
                    <td>{option.price}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEditClick(option)}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteOption(option)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Fragment>
  );
}

export default OptionCategory;
