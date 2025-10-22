import axios from "axios";

export const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    java: 62,
    javascript: 63,
  };
  return language[lang.toLowerCase()];
};

export const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false", //true => by default
    },
    headers: {
      "x-rapidapi-key": "1c839a7ca3msh0935978a808f1acp131f9ajsn35e2e9c9f41b",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  return await fetchData();
};


async function waiting(timer){
    setTimeout(()=>{
        return 1;
    }, timer)
}

export const submitToken = async (resultToken) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: resultToken.join(","),
      base64_encoded: "false", //true => by default
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": "1c839a7ca3msh0935978a808f1acp131f9ajsn35e2e9c9f41b",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  while (true) {
    const result = await fetchData();
    const isResultObtained = result.submissions.every((r) => r.status_id > 2);
    if (isResultObtained) return result.submissions;

    await waiting(1000*1)
  }
};
