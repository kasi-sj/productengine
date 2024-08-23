import axios from "axios";

export const getColumn = async (configuration: {
    partitionName: string;
    username: string;
    password: string;
    baseURL: string;
  }) => {
    try {
      const { partitionName, username, password, baseURL } = configuration;
      const body = {
        startRow: 0,
        endRow: 1,
        operationType: "fetch",
      };
  
      const resp = await axios.post(
        `${baseURL}/pricefx/${partitionName}/productmanager.fetchformulafilteredproducts`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(
              `${partitionName}/${username}:${password}`
            ).toString("base64")}`,
          },
        }
      );
  
      const data = resp.data.response;
      const columns: any = [];
  
      data.data.forEach((element: {}) => {
        Object.keys(element).forEach((key) => {
          columns.push({ key: key, Label: key });
        });
      });
  
      return columns;
    } catch (e) {
      return [];
    }
  };