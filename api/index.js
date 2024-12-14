import axios from "axios";

const API_KEY = "46441337-5359db12be9d260c06d9669f8";

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (params) => {
  let url = apiUrl + "&per_page=25&safesearch=true&editors_choise=true";
  if (!params) return url;
  let paramsKeys = Object.keys(params);
  paramsKeys.forEach((key) => {
    let value = key == "q" ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });

  //   console.log("url: " + url);
  return url;
};
export const apiCall = async (params) => {
  try {
    const res = await axios.get(formatUrl(params));
    const { data } = res;
    return { success: true, data };
  } catch (error) {
    console.log("Error: " + error);
    return { success: false, msg: error.message };
  }
};
