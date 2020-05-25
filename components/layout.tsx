import React from "react";

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
      <style global jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Piedra&display=swap");
        .container {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }
        .col-1 {
          font-size: 3.2rem;
          width: 100%;
          background-image: url('/sky.jpg');
          background-size: cover;
          background-position: center;
          background-reapet: repeat;
          box-shadow: 10px 10px 10px -1px black;
        }
        .title {
          padding-left: 10px;
          float: left;
          font-family: 'Piedra', cursive;
          color : rgba(180, 20, 100, 1.1);
          transition-duration: 1s;
          transition-timing-function: ease-in; 
        }
        .title:hover {
          font-size: 3.5;
          transform: rotateY(-40deg);
          font-style: italic;
        }
        .profile {
          float: right;
          padding: 6px;
          padding-down: 8px;
          padding-top: 2px;
          margin-top: 6px;
          margin-right: 10px;
          border-radius: 50%;
          color : red;
          transition: all 0.5s ease-in;
          border: 1px solid black;
        }
        .profile:hover {
          transform: rotateZ(10deg) rotateY(30deg);
        }
        .col-2 {
          padding-top : 10px;
          border-radius: 10px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};
