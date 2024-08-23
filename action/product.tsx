import axios from "axios";

export const searchProduct = async (
  configuration: {
    partitionName: string;
    username: string;
    password: string;
    baseURL: string;
  },
  startRow: number,
  endRow: number,
  search: string
) => {
  console.log(
    configuration,
    
  )
  const { partitionName, username, password, baseURL } = configuration;
  var body: any = {
    endRow,
    operationType: "fetch",
    startRow,
  };

  const columns = await getColumn(configuration);
  if (search !== "") {
    body = {
      ...body,
      data: {
        operator: "or",
        _constructor: "AdvancedCriteria",
        criteria: Object.keys(columns)
          .map((f: any) => {
            return {
              fieldName: f.key,
              operator: "iContains",
              value: search,
            };
          })
          .filter((item) => {
            return item.value != "";
          }),
      },
    };
  }

  const resp = await axios.post(
    `${baseURL}/pricefx/${partitionName}/productmanager.fetchformulafilteredproducts`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(`${partitionName}/${username}:${password}`).toString(
            "base64"
          ),
      },
    }
  );

  const data = resp.data.response;
  const totalRows = data.totalRows;
  const result = {
    data: data.data,
    totalRows,
  };
  return result;
};

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
    const columns: { key: string; Label: string }[] = [];

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
