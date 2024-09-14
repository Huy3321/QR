import classNames from "classnames";
import axios from "axios";
import styles from "./menu.scss";
import HomeIcon from "../../assets/image/Icon/home.png";
import SearchIcon from "../../assets/image/Icon/search.png";
import CancelIcon from "../../assets/image/Icon/close.png";
import { useNavigate } from "react-router-dom";
import DetailProduct from "../../components/DetailProduct/index";
import useEmblaCarousel from "embla-carousel-react";
import { Fragment, useEffect, useState } from "react";
import food from "../../assets/image/Icon/fast-food-19.png";
import plus from "../../assets/image/Icon/plus.png";
import minus from "../../assets/image/Icon/minus.png";
import cart from "../../assets/image/Icon/grocery-store.png";
import rightArrow from "../../assets/image/Icon/right-arrow.png";
const cx = classNames.bind(styles);
function Menu() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [emblaRef] = useEmblaCarousel({ dragFree: true });
  // Khởi tạo biến theo dõi cart
  const [cartItems, setCartItems] = useState([]);
  const [reloadCart, setReloadCart] = useState(false);
  // Khởi tạo biến theo dõi page và số lượng page tối đa
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);

  // Khởi tạo trạng thái cho danh sách dish và danh sách category
  const [categoryLoaded, setCategoryLoaded] = useState(false);
  const [dishList, setDishList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  // Khởi tạo trạng thái cho tìm kiếm
  const [searchText, setSearchText] = useState("");

  // Khởi tạo trạng thái cho biến theo dõi category
  const [currentCategoryId, setCurrentCategoryId] = useState(0);
  const [options, setOptions] = useState([]);
  // Khởi tạo các biến dùng cho detail product
  const [showDetailProduct, setShowDetailProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  //get all category list

  // Fetch category list
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/v1/category/all`, config)
      .then((response) => {
        const data = response.data;
        if (data && data.status === 200) {
          setCategoryList(data.listCategories);
          setCurrentCategoryId(data.listCategories[0].id);
          setCategoryLoaded(true); // Indicate that categories are loaded
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //fetch option list
  useEffect(() => {
    // Fetch options whenever the selected category changes
    const fetchOptions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/option?category_id=${currentCategoryId}`
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
  }, [currentCategoryId]);

  // Fetch initial dish list
  useEffect(() => {
    if (!categoryLoaded) return; // Ensure categories are loaded before proceeding

    const fetchDishes = async () => {
      let url = `${process.env.REACT_APP_API_URL}/v1/dish/searchDishes?page=1&pageSize=10`;
      if (searchText !== "") {
        url += `&search=${searchText}`;
      } else {
        url += `&category_id=${currentCategoryId}`;
      }

      try {
        const response = await axios.get(url, config);
        const data = response.data;
        if (data && data.status === 200) {
          setDishList(data.data.dishes);
          setMaxPages(data.data.pagesNumber);
          if (searchText !== "") {
            setCurrentCategoryId(0); // Reset category ID when searching
          }
        }
      } catch (error) {
        console.error("Failed to fetch dishes:", error);
      }
    };

    fetchDishes();
  }, [searchText, currentCategoryId, categoryLoaded]);

  //load next page
  useEffect(() => {
    if (currentPage > 1) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/v1/dish/searchDishes?page=${currentPage}&pageSize=10&category_id=${currentCategoryId}`,
          config
        )
        .then((response) => {
          const data = response.data;
          if (data && data.status === 200) {
            // Kết hợp mảng cũ với mảng mới lấy từ API
            setDishList((prevDishes) => [...prevDishes, ...data.data.dishes]);
            setMaxPages(data.data.pagesNumber);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [currentPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage, maxPages]);

  useEffect(() => {
    const loadCartItems = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(storedCart);
    };

    loadCartItems();
  }, [reloadCart]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      loadNextPage();
    }
  };

  const loadNextPage = () => {
    if (currentPage < maxPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleImageError = (e) => {
    console.log(e.target.src);

    e.target.src = food; // Đặt nguồn ảnh mặc định
  };

  const handleSelectCategory = (category) => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);

    // Set the current category ID after scrolling
    setCurrentCategoryId(category.id);
  };

  function addToCartLocalWithNote(product, quantity, note, selectedOption) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(
      (x) => x.id === product.id && x.option_id === selectedOption.id
    );

    if (existingItemIndex !== -1) {
      // If the product with the same option is already in the cart, update its information
      cart[existingItemIndex].cartQuantity = quantity;
      cart[existingItemIndex].note = note;
      cart[existingItemIndex].option_id = selectedOption.id;
      cart[existingItemIndex].option_name = selectedOption.name;
      cart[existingItemIndex].option_price = selectedOption.price;
    } else {
      // If the product with the same option is not in the cart, add it as a new item
      const newItem = {
        ...product,
        cartQuantity: quantity,
        note: note,
        option_id: selectedOption.id,
        option_name: selectedOption.name,
        option_price: selectedOption.price,
      };
      cart.push(newItem);
    }

    // Save the updated cart back to Local Storage
    localStorage.setItem("cart", JSON.stringify(cart));
    handleCloseDetail(); // Close the detail view or dialog
    setReloadCart((prevReloadCart) => !prevReloadCart); // Toggle state to trigger re-render
  }

  function addToLocalCart(item, type) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItemIndex = cart.findIndex((x) => x.id === item.id);

    if (existingItemIndex !== -1) {
      //Cập nhật số lượng dựa trên type
      if (type === "ADD") {
        cart[existingItemIndex].cartQuantity += 1;
      } else if (type === "MINUS") {
        if (
          cart[existingItemIndex].cartQuantity > 1 &&
          cart[existingItemIndex].cartQuantity < 100
        ) {
          // Giảm số lượng nếu lớn hơn 1
          cart[existingItemIndex].cartQuantity -= 1;
        } else {
          // Xóa sản phẩm khỏi giỏ hàng nếu số lượng về 0
          cart.splice(existingItemIndex, 1);
        }
      }
    } else {
      // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng với cartQuantity và note
      const newItem = {
        ...item,
        cartQuantity: 1, // Sử dụng cartQuantity từ đầu vào
        note: "", // Sử dụng note từ đầu vào
        option_id: null,
        option_name: "",
        option_price: 0,
      };
      cart.push(newItem);
    }

    // Lưu giỏ hàng trở lại vào Local Storage
    localStorage.setItem("cart", JSON.stringify(cart));
    setReloadCart(!reloadCart);
  }

  const handleCloseDetail = () => {
    setShowDetailProduct(false);
    setSelectedProduct(null);
  };

  const handleOpenDetail = (product, e) => {
    e.stopPropagation(); // Ngăn sự kiện nổi bọt
    setSelectedProduct(product);
    setShowDetailProduct(true);
  };

  const handleActionClick = (e) => {
    e.stopPropagation(); // Ngăn sự kiện nổi bọt để không kích hoạt hàm handleOpenDetail khi nhấn vào các nút trong 'action-with-item-in-cart'
  };

  return (
    <div className={cx("page-menu-restaurant")}>
      {showDetailProduct && (
        <Fragment>
          <div
            className={cx("overlay")}
            onClick={() => handleCloseDetail()}
          ></div>
          <DetailProduct
            product={selectedProduct}
            textConfirm={"Thêm vào giỏ"}
            closeFunction={handleCloseDetail}
            confirmFunction={addToCartLocalWithNote}
            options={options}
          ></DetailProduct>
        </Fragment>
      )}
      <div className={cx("menu-top-bar")}>
        <div
          className={cx("return-home-container")}
          onClick={() => navigate(`/home/${token}`)}
        >
          <img src={HomeIcon} alt="Home" />
        </div>
        <div className={cx("search-component")}>
          <img src={SearchIcon} alt="Icon"></img>
          <input
            value={searchText}
            placeholder="Bạn muốn tìm món gì?"
            onChange={(e) => setSearchText(e.target.value)}
          ></input>
          {searchText !== "" && (
            <img
              src={CancelIcon}
              alt="Icon"
              onClick={() => setSearchText("")}
            ></img>
          )}
        </div>
      </div>
      <div className={cx("category-container")}>
        <div className={cx("embla")} ref={emblaRef}>
          <div className={cx("embla__container")}>
            {categoryList.map((category, index) => (
              <div
                className={cx("embla__slide")}
                key={index}
                onClick={() => handleSelectCategory(category)}
              >
                <div
                  className={cx("embla__slide__number", {
                    active: category.id === currentCategoryId,
                  })}
                >
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={cx("menu-content-body")}>
        <div className={cx("header-area")}></div>
        <div className={cx("dish-list-container")}>
          {dishList.map((dish, index) => (
            <div
              key={dish.id + index}
              className={classNames("dish-container")}
              onClick={(e) => handleOpenDetail(dish, e)}
            >
              <div className={classNames("image-container")}>
                <img src={dish.image} alt="Ảnh" onError={handleImageError} />
              </div>
              <div className={classNames("dish-name")}>{dish.name}</div>
              <div className={classNames("price-and-plus")}>
                <div className={classNames("dish-price")}>
                  {dish.price.toLocaleString("vi-VN", {
                    currency: "VND",
                  })}
                </div>
                {cartItems.some((item) => item.id === dish.id) && (
                  <div className={cx("action-with-item-in-cart")}>
                    <div className={classNames("dish-add-to-cart")}>
                      <img
                        src={minus}
                        alt="Bớt"
                        onClick={(e) => {
                          handleActionClick(e);
                          addToLocalCart(dish, "MINUS");
                        }}
                      />
                    </div>
                    <div className={cx("cartQuantity")}>
                      {
                        cartItems.find((item) => item.id === dish.id)
                          .cartQuantity
                      }
                    </div>
                    <div className={classNames("dish-add-to-cart")}>
                      <img
                        src={plus}
                        alt="Thêm"
                        onClick={(e) => {
                          handleActionClick(e);
                          addToLocalCart(dish, "ADD");
                        }}
                      />
                    </div>
                  </div>
                )}
                {!cartItems.some((item) => item.id === dish.id) && (
                  <div className={classNames("dish-add-to-cart")}>
                    <img
                      src={plus}
                      alt="Thêm"
                      onClick={(e) => {
                        handleActionClick(e);
                        addToLocalCart(dish, "ADD");
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          {dishList.length === 0 && (
            <div className={cx("empty-category")}>Không có sản phẩm </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div
            className={cx("bottom-cart-bar")}
            onClick={() => navigate("/orderdetails")}
          >
            <div className={cx("lead-icon")}>
              <img src={cart} alt="Cart"></img>
            </div>
            <div className={cx("text-cart-bar")}>
              Xem giỏ hàng ({cartItems.length})
            </div>
            <div className={cx("trail-icon")}>
              <img src={rightArrow} alt="Right"></img>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
