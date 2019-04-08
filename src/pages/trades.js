import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import MyTable from "../component/MyTable";
import moment from "moment";
import { Form, Layout, Input, Button, Checkbox } from "element-react";
import DatePick from "../component/DatePick";
import instance from "../config/config";

//make a request cancelable
const CancelToken = axios.CancelToken;

export default function trades() {
 const cancelSource = useRef(null);
 const cancelSource2 = useRef(null);
 // pagination manages pagination related state, such as page number, page size and total amount
 const [pagination, setPagination] = useState({ number: 1, size: 10, total: 1 });
 // tableData is the 'trades' response data from api
 const [tableData, setTableData] = useState([]);
 //option manages 'side' and 'tradingPair' filter statue
 const [option, setOption] = useState({ side: [], tradingPair: {} });
 //loading is used to show or hide loading indicator
 const [loading, setLoading] = useState(false);
 //formData manages all the user input values and will be sent to api after user clicks 'search' button
 const [formData, setFormData] = useState({
  uuid: null,
  volume: null,
  price: null,
  selectedSide: [],
  selectedTradePairSymbol: [],
  selectedUpdatedAt: []
 });
 // tableColumn manages column labels on the table
 const [tableColumn, setTableColumn] = useState([
  { type: "index" },
  {
   label: "Uuid",
   prop: "uuid",
   width: 160,
   align: "center"
  },
  {
   label: "Updated at",
   prop: "updatedAt",
   align: "center",
   width: 140,
   headerAlign: "center",
   render: row => {
    return moment(row.updatedAt).format("DD/MM/YYYY");
   }
  },

  {
   label: "Side",
   prop: "side",
   align: "center",
   width: 90,
   headerAlign: "center"
  },
  {
   label: "Volume",
   prop: "volume",
   align: "center",
   width: 100,
   headerAlign: "center"
  },
  {
   label: "Price",
   prop: "price",
   align: "center",
   width: 100,
   headerAlign: "center"
  },

  {
   label: "Trading pair symbol",
   prop: "",
   align: "center",
   width: 180,
   headerAlign: "center",
   render: row => {
    return row.tradingPair.symbol;
   }
  }
 ]);

 const fetchData = () => {
  setLoading(true);
  instance
   .get("/trades.json", {
    cancelToken: cancelSource.current.token
   })
   .then(res => {
    return (
     setTableData(res.data.trades),
     setPagination(res.data.pagination),
     setOption(res.data.option),
     setLoading(false)
     //console.log(res)
    );
   })
   .catch(res => console.log(res));
 };
 const onChange = (key, value) => {
  setFormData({ ...formData, [key]: value });
 };

 //getParameters function is used to get parameters that will be used in api. If you give this function a 'uuid' parameter, it returns 'filter[uuid]=[the value in current state]'
 const getParameters = parameter => {
  switch (parameter) {
   case "uuid":
   case "volume":
   case "price":
    return `filter[${parameter}]=${formData[parameter] === null ? "" : formData[parameter]}`;
   case "side":
    let sideArray = [];
    let sideParameter;
    if (formData.selectedSide.length > 1) {
     formData.selectedSide.map(el => {
      return sideArray.push(`filter[side]=${el}`);
     });
     sideParameter = sideArray.join("&&");
    } else {
     sideParameter = `filter[side]=${formData.selectedSide}`;
    }
    return sideParameter;
   case "tradingPair":
    let tradePairArray = [];
    let tradePairParameter;
    if (formData.selectedTradePairSymbol.length > 1) {
     formData.selectedTradePairSymbol.map(el => {
      return (
       tradePairArray.push(`filter[tradingPair][symbol][inq]=${el}`),
       (tradePairParameter = tradePairArray.join("&&"))
      );
     });
    } else {
     tradePairParameter = `filter[tradingPair][symbol][inq]=${formData.selectedTradePairSymbol}`;
    }
    return tradePairParameter;
   case "updated":
    let updateArray;
    if (formData.selectedUpdatedAt.length > 0) {
     updateArray = [
      `filter[updatedAt][gte]=${moment(formData.selectedUpdatedAt[0]).format("YYYY-MM-DD")}`,
      `filter[updatedAt][lte]=${moment(formData.selectedUpdatedAt[1]).format("YYYY-MM-DD")}`
     ];
    } else {
     updateArray = [`filter[updatedAt][gte]=`, `filter[updatedAt][lte]=`];
    }
    let updatedParameter = updateArray.join("&&");
    return updatedParameter;
   default:
    return;
  }
 };

 // when mount the component, run this function
 useEffect(() => {
  cancelSource.current = CancelToken.source();
  // we need to make users' results persistent,we use localStorage to store results.
  //In order to successfully store an object as a value, I have to use JSON.stringify() and use JSON.parse() to get back the value
  // First check localStorage
  if (JSON.parse(localStorage.getItem("trade")) !== null) {
   let retrievedFormData = JSON.parse(localStorage.getItem("trade"));
   //  'updated at' time range is a little bit different
   //because after JSON.parse(),each element in original time range,[time,time], becomes a string, However I need it to be a date because the 'datePicker' from 'element-ui' requires a date not a string
   // the following method is used to do this transformation
   if (retrievedFormData.selectedUpdatedAt.length === 2) {
    let dateRange = [
     new Date(retrievedFormData.selectedUpdatedAt[0]),
     new Date(retrievedFormData.selectedUpdatedAt[1])
    ];
    retrievedFormData.selectedUpdatedAt = dateRange;
    //console.log(retrievedFormData);
   }
   setFormData(retrievedFormData);
  } else {
   fetchData();
  }
  return () => {
   cancelSource.current.cancel();
  };
 }, []);

 //the following useEffect(()=>{},[localStorage.getItem('trade')])
 //acts like the old componentDidUpdate, it watches the value localStorage.getItem('trade'),
 //if it changes, this component will be updated to get results from server
 useEffect(() => {
  cancelSource2.current = CancelToken.source();
  localStorage.setItem("trade", JSON.stringify(formData));
  getFilteredData(1, pagination.size);
  return () => {
   cancelSource2.current.cancel();
  };
 }, [localStorage.getItem("trade")]);
 const search = () => {
  //console.log(formData);
  localStorage.setItem("trade", JSON.stringify(formData));
  getFilteredData(1, pagination.size);
 };

 // getFilteredData function is used to compose a complete URL, and send it to the server
 const getFilteredData = (number, size) => {
  // get all the parameters that is required in the URL
  let updatedParameter = getParameters("updated");
  let uuidParameter = getParameters("uuid");
  let volumeParameter = getParameters("volume");
  let priceParameter = getParameters("price");
  let sideParameter = getParameters("side");
  let tradePairParameter = getParameters("tradingPair");

  instance
   .get(
    `/trades.json?${updatedParameter}&&${uuidParameter}&&${volumeParameter}&&${priceParameter}&&${sideParameter}&&${tradePairParameter}&&pagination[number]=${number}&&pagination[size]=${size}`
   )
   .then(res => {
    return (
     setTableData(res.data.trades),
     setPagination(res.data.pagination),
     setOption(res.data.option),
     setLoading(false)
     //console.log(res)
    );
   })
   .catch(err => console.log(err));
 };

 //this function changes page number
 const currentPageChange = currentPage => {
  setPagination({ ...pagination, number: currentPage });
  let number = pagination.size;
  getFilteredData(currentPage, number);
 };

 //this function changes page size
 const pageSizeChange = pageSize => {
  setPagination({ ...pagination, size: pageSize });
  getFilteredData(1, pageSize);
 };

 //this function clears user's input values and get data from server
 const reset = () => {
  setFormData({
   uuid: null,
   volume: null,
   price: null,
   selectedSide: [],
   selectedTradePairSymbol: [],
   selectedUpdatedAt: []
  });
  localStorage.setItem("trade", JSON.stringify(null));
  fetchData();
 };
 // console.log(formData);
 return (
  <div className="container bg-light">
   <Form labelWidth="100px" labelPosition="left">
    <Form.Item label="Uuid">
     <Layout.Col span="6">
      <Input placeholder="uuid" value={formData.uuid} onChange={onChange.bind(this, "uuid")} />
     </Layout.Col>
    </Form.Item>
    <Form.Item label="Volume">
     <Layout.Col span="6">
      <Input
       placeholder="Volume"
       value={formData.volume}
       onChange={onChange.bind(this, "volume")}
      />
     </Layout.Col>
    </Form.Item>
    <Form.Item label="Price">
     <Layout.Col span="6">
      <Input
       placeholder="Price"
       value={formData.price}
       onChange={onChange.bind(this, "price")}
       type="number"
      />
     </Layout.Col>
    </Form.Item>
    <Form.Item label="Side">
     <Layout.Col span="6">
      {option.side.length > 0 ? (
       <Checkbox.Group value={formData.selectedSide} onChange={onChange.bind(this, "selectedSide")}>
        {option.side.map(el => {
         return <Checkbox key={el} label={el} />;
        })}
       </Checkbox.Group>
      ) : (
       "Loading"
      )}
     </Layout.Col>
    </Form.Item>
    <Form.Item label="Trade Pair Symbol">
     <Layout.Col span="9">
      {Object.keys(option.tradingPair).length > 0 ? (
       <Checkbox.Group
        value={formData.selectedTradePairSymbol}
        onChange={onChange.bind(this, "selectedTradePairSymbol")}
       >
        {option.tradingPair.symbol.map(el => {
         return <Checkbox key={el} label={el} />;
        })}
       </Checkbox.Group>
      ) : (
       "Loading"
      )}
     </Layout.Col>
    </Form.Item>
    <Form.Item label="Updated at">
     <Layout.Col span="6">
      <DatePick
       dateRange={formData.selectedUpdatedAt}
       onChange={updatedAt => setFormData({ ...formData, selectedUpdatedAt: updatedAt })}
      />
     </Layout.Col>
    </Form.Item>
    <Form.Item label="">
     <Button type="primary" onClick={search}>
      Search
     </Button>
     <Button onClick={reset}>Reset</Button>
    </Form.Item>
   </Form>
   <hr />
   <p className="lead">Search Results</p>
   <MyTable
    total_amount={pagination.total}
    current_page={parseInt(pagination.number)}
    currentPageChange={currentPageChange}
    pageSize={parseInt(pagination.size)}
    pageSizeChange={pageSizeChange}
    loading={loading}
    data={tableData}
    columns={tableColumn}
   />
  </div>
 );
}
