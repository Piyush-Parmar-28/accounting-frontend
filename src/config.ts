let config: {
  baseURL: string;
};

console.log("Environment =>", process.env.REACT_APP_NODE_ENV);

if (process.env.REACT_APP_NODE_ENV === "production") {
  config = {
    baseURL: "https://app.rapidbooks.co/api",
  };
} else if (process.env.REACT_APP_NODE_ENV === "staging") {
  config = {
    baseURL: "https://dev.rapidbooks.co/api",
  };
} else {
  config = {
    baseURL: "http://localhost:5002/api",
  };
}

export default config;
