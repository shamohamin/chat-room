import React, { useState, ChangeEvent, useEffect } from "react";
import validator from "validator";
import "../style/index.css";

export const Home: React.FunctionComponent<{}> = () => {
  const [email, setstate] = useState("");
  const [err, errSetState] = useState([] as string[]);
  const [attentionErr, setAttention] = useState("");

  const onChange: (ev: ChangeEvent<HTMLInputElement>) => void = (ev) => {
    ev.persist();
    errSetState(() => checkErr(ev.target.value.trim()));
    setstate(() => ev.target.value.trim());
  };

  useEffect(() => {
    let len = email.length;
    const emailInput = document.getElementById("email");
    const handler = emailInput?.addEventListener("focus", () => {
      const label = document.getElementById("email-label");
      if (label) {
        label.className = "label-focus";
      }
    });
    const outFocus = emailInput?.addEventListener("focusout", () => {
      const label = document.getElementById("email-label");
      console.log(len);
      if (
        label &&
        document.getElementById("email") &&
        document.getElementById("email")?.innerText.length === 0 && 
        len === 0
      ) {
        label.className = "label";
      }
    });
    return () => {
      if (handler) removeEventListener("focus", handler);
      if (outFocus) removeEventListener("focusout", outFocus);
    };
  }, [email]);

  const checkErr: (data: string) => string[] = (data) => {
    let errors = [] as string[];
    if (validator.isEmpty(data)) {
      errors.push("value required!!!");
    } else {
      if (!validator.isEmail(data)) {
        errors.push("check format of email!!");
      }
    }

    return errors;
  };

  const onSubmit: () => void = () => {
    if (err.length === 0) {
      setAttention("");
    } else {
      setAttention("Pay Attention To Rules!!!!");
    }
  };

  return (
    <div>
      <div className="card">
        <div className="header">
          <h1>Sign in</h1>
          <p>Please insert your email to connect.</p>
        </div>
        {attentionErr && <span>{attentionErr}</span>}
        <div className="form">
          <label className="label" id="email-label">
            email
          </label>
          <input
            type="text"
            autoComplete="off"
            onChange={(ev: ChangeEvent<HTMLInputElement>) => onChange(ev)}
            name="email"
            value={email}
            id="email"
            autoFocus={true}
          />
          <div>{err && err.map((er) => <span key={er}>{er}</span>)}</div>
          <input type="button" onClick={onSubmit} value="submit" />
        </div>
      </div>
    </div>
  );
};
