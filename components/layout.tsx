import React from "react";
import "../style/layout.css";

export default (props: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="container">
        <div className="col-1">
          <span className="title"> chat room </span>
          <span className="profile fas fa-user fa-sm"></span>
        </div>
        <div className="col-2">
          <div className="content">{props.children}</div>
        </div>
      </div>
    </div>
  );
};
