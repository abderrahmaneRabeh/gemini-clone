import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPromps, setPrevPromps] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (idx, next) => {
    setTimeout(() => {
      setResultData((prev) => prev + next);
    }, 75 * idx);
  };

  const newChat = () => {
    setShowResult(false);
    setLoading(false);
  };

  const onSend = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let response;

    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPromps((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }

    let resArray = response.split("**");
    let newResponse = "";

    for (let i = 0; i < resArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += resArray[i];
      } else {
        newResponse += `<b>${resArray[i]}</b>`;
      }
    }

    let newResponse2 = newResponse.split("*").join("<br/>");

    let newResponseArray = newResponse2.split(" ");

    for (let i = 0; i < newResponseArray.length; i++) {
      delayPara(i, newResponseArray[i] + " ");
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    prevPromps,
    setPrevPromps,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    newChat,
    onSend,
  };

  return (
    // eslint-disable-next-line react/prop-types
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
