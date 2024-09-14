import React from "react";
import classNames from "classnames/bind";
import styles from "./InteractionItem.scss";

const cx = classNames.bind(styles);

const InteractionItem = ({
  iconName,
  description,
  backgroundColor,
  callback,
}) => {
  return (
    <div className={cx("interaction-item")} onClick={callback}>
      <div
        className={cx("image-background")}
        style={{ backgroundColor: backgroundColor }}
      >
        <img src={iconName} alt="ICON" />
      </div>
      <div className="text-description">{description}</div>
    </div>
  );
};

export default InteractionItem;
