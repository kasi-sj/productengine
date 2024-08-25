"use server";
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
  const { partitionName, username, password, baseURL } = configuration;
  var body: any = {
    operationType: "fetch",
    endRow,
    startRow,
  };

  const columns = await getColumn(configuration);
  if (search !== "") {
    body = {
      ...body,
      data: {
        operator: "or",
        _constructor: "AdvancedCriteria",
        criteria: columns
          .map((f: any) => {
            return {
              fieldName: f.key,
              operator: "iContains",
              value: search,
            };
          })
          .filter((item) => {
            return item.value != "" && item.fieldName !== "typedId";
          }),
      },
    };
  }
  console.log(JSON.stringify(body));
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

export const advancedSearch = async (
  startRow: number,
  endRow: number,
  configuration: {
    partitionName: string;
    username: string;
    password: string;
    baseURL: string;
  },
  filter: any
) => {
  try {
    const { partitionName, username, password, baseURL } = configuration;
    const body = {
      startRow: startRow,
      endRow: endRow,
      operationType: "fetch",
      textMatchStyle: "exact",
      data: filter,
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
    const totalRows = data.totalRows;
    return {
      data: data.data,
      totalRows,
    };
  } catch (e) {
    return {
      data: [],
      totalRows: 0,
    };
  }
};

export const getProduct = async (
  configuration: {
    partitionName: string;
    username: string;
    password: string;
    baseURL: string;
  },
  sku: string
) => {
  const { partitionName, username, password, baseURL } = configuration;
  var body: any = {
    operationType: "fetch",
    data: {
      sku: sku,
    },
  };

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
  const result = {
    data: data.data[0],
  };
  return result;
};

export const getSimilarProducts = async (
  configuration: {
    partitionName: string;
    username: string;
    password: string;
    baseURL: string;
  },
  sku: string
) => {
  const { partitionName, username, password, baseURL } = configuration;
  var body: any = {
    operationType: "fetch",
    data: {
      sku: sku,
    },
  };
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

  const product = resp.data.response.data[0];
  body = {
    ...body,
    endRow: 10,
    startRow: 0,
    data: {
      operator: "or",
      _constructor: "AdvancedCriteria",
      criteria: Object.keys(product)
        .map((f: any) => {
          return {
            fieldName: f,
            operator: "iContains",
            value: product[f],
          };
        })
        .filter((item) => {
          return item.value != "" && item.fieldName !== "typedId";
        }),
    },
  };
  const res = await axios.post(
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

  const data = res.data.response;
  const totalRows = data.totalRows;
  const result = {
    data: data.data.filter((item: any) => item.sku !== sku),
    totalRows,
  };
  return result;
};

export const getProductExtension = async (
  configuration: {
    partitionName: string;
    username: string;
    password: string;
    baseURL: string;
  },
  sku: string
) => {
  const { partitionName, username, password, baseURL } = configuration;

  const resp = await axios.get(
    `${baseURL}/pricefx/${partitionName}/configurationmanager.get/productextension`,
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

  const px = JSON.parse(resp.data.response.data[0]);
  const query = new URLSearchParams({
    output: "json",
    useColumnNames: "true",
  }).toString();
  const data: any = {};
  console.log();
  const entry = Object.keys(px).map(async (key) => {
    const value = px[key];
    try {
      const resp = await axios.post(
        `${baseURL}/pricefx/${partitionName}/productmanager.fetch/*/PX/${key}?${query}`,
        {
          endRow: 1,
          startRow: 0,
          textMatchStyle: "exact",
          data: {
            sku: sku,
          },
        },
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
      const result = resp.data.response.data;
      if (result.length > 0) {
        data[key] = {
          struct: value,
          data: result[0],
        };
      }
    } catch (e) {
      console.log(e);
    }
  });
  await Promise.all(entry);
  console.log(data);
  return data;
};
