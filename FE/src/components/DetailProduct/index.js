import React, { useState, useEffect } from "react";
import className from "classnames";
import styles from "./DetailProduct.scss";
import returnIcon from "../../assets/image/Icon/close.png";
import noteIcon from "../../assets/image/Icon/notes.png";
import minusIcon from "../../assets/image/Icon/minus.png";
import plusIcon from "../../assets/image/Icon/plus.png";
const cx = className.bind(styles);

function DetailProduct({
  product,
  textConfirm,
  closeFunction,
  confirmFunction,
  currentNote,
  currentQuantity,
  options, // New prop for options
}) {
  const [quantity, setQuantity] = useState(
    currentQuantity ? currentQuantity : 1
  );
  const [note, setNote] = useState(currentNote ? currentNote : "");
  const [selectedOption, setSelectedOption] = useState({
    id: "",
    name: "",
    price: 0,
  }); // New state for selected option

  useEffect(() => {
    if (options && options.length > 0) {
      const option = options.find((option) => option.id === product.option_id);
      if (option) {
        setSelectedOption(option);
      }
    }
  }, [options]);

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };

  return (
    <div className={cx("detail-product-container")}>
      <div className={cx("image-container")}>
        <img src={product.image} alt="PRODUCT-IMAGE" />
      </div>
      <div className={cx("return-button-container")} onClick={closeFunction}>
        <img src={returnIcon} alt="RETURN" />
      </div>
      <div className={cx("detail-container")}>
        <div className={cx("detail-name")}>{product.name}</div>
        <div className={cx("detail-description")}>{product.description}</div>
      </div>
      <div className={cx("option-container")}>
        {/* Display Options */}
        {options && options.length > 0 && (
          <div className={cx("options-list")}>
            {options.map((option, index) => (
              <div
                key={option.id}
                className={cx("option-item", {
                  selected: selectedOption.id === option.id,
                })}
                onClick={
                  () =>
                    selectedOption.id === option.id
                      ? setSelectedOption({ id: "", name: "", price: 0 }) // Deselect if already selected
                      : setSelectedOption(option) // Select if not already selected
                }
              >
                <div className={cx("option-name")}>
                  {index + 1}. {option.name}
                </div>
                <div className={cx("option-price")}>
                  {option.price.toLocaleString("vi-VN")} đ
                </div>
              </div>
            ))}
          </div>
        )}
        <div></div>

        {/* Note Input and Bottom Bar */}
        <div className={cx("note-and-bottom-bar")}>
          <div className={cx("note-container")}>
            <img src={noteIcon} alt="NOTE" />
            <textarea
              placeholder="Ghi chú cho món ăn"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>

          <div className={cx("bottom-bar")}>
            <div className={cx("action-with-product")}>
              <div
                className={cx("minus-container")}
                onClick={decrementQuantity}
              >
                <img src={minusIcon} alt="MINUS" />
              </div>
              <div className={cx("input-quantity")}>
                <input
                  type="tel"
                  maxLength={4}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
              </div>
              <div className={cx("plus-container")} onClick={incrementQuantity}>
                <img src={plusIcon} alt="PLUS" />
              </div>
            </div>
            <div
              className={cx("add-to-cart-button")}
              onClick={() =>
                confirmFunction(product, quantity, note, selectedOption)
              }
            >
              <div className={cx("add-to-cart-title")}>
                {textConfirm} ({quantity})
              </div>
              <div className={cx("add-to-cart-price")}>
                {(
                  (product.price + selectedOption.price) *
                  quantity
                ).toLocaleString("vi-VN")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;
