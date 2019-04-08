import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import MyTable from "../component/MyTable";
import moment from "moment";
import { Form, Layout, Input, Button, Checkbox } from "element-react";
import DatePick from "../component/DatePick";
import instance from "../config/config";

//make a request cancelable
const CancelToken = axios.CancelToken;

export default function withdraws() {
 // the logical in this 'withdraws' component is very similar to that in 'trades' component,
 // please refer to the comments in 'trades' component if necessary.
 const cancelSource = useRef(null);
 const cancelSource2 = useRef(null);
 const [pagination, setPagination] = useState({ number: 1, size: 10, total: 1 });
 const [tableData, setTableData] = useState([]);
 const [option, setOption] = useState({ status: [] });
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
  uuid: null,
  amount: null,
  bankReferenceNumber: null,
  selectedStatus: [],
  selectedCreatedAt: []
 });
 const [tableColumn, setTableColumn] = useState([
  { type: "index" },
  {
   label: "Uuid",
   prop: "uuid",
   width: 190,
   align: "center"
  },
  {
   label: "Created at",
   prop: "createdAt",
   align: "center",
   width: 140,
   headerAlign: "center",
   render: row => {
    return moment(row.createdAt).format("DD/MM/YYYY");
   }
  },

  {
   label: "Status",
   prop: "status",
   align: "center",
   width: 120,
   headerAlign: "center"
  },
  {
   label: "Amount",
   prop: "amount",
   align: "center",
   width: 130,
   headerAlign: "center"
  },
  {
   label: "Bank reference number",
   prop: "bankReferenceNumber",
   align: "center",
   width: 200,
   headerAlign: "center"
  }
 ]);

 //  useEffect(() => {
 //   cancelSource.current = CancelToken.source();
 //   fetchData();
 //   return () => {
 //    cancelSource.current.cancel();
 //   };
 //  }, []);
 const fetchData = () => {
  setLoading(true);
  instance
   .get("/withdraws.json", {
    cancelToken: cancelSource.current.token
   })
   .then(res => {
    return (
     setTableData(res.data.withdraws),
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
 const getParameters = parameter => {
  switch (parameter) {
   case "uuid":
   case "amount":
   case "bankReferenceNumber":
    return `filter[${parameter}]=${formData[parameter] === null ? "" : formData[parameter]}`;
   case "status":
    let statusArray = [];
    let statusParameter;
    if (formData.selectedStatus.length > 1) {
     formData.selectedStatus.map(el => {
      return statusArray.push(`filter[status]=${el}`);
     });
     statusParameter = statusArray.join("&&");
    } else {
     statusParameter = `filter[status]=${formData.selectedStatus}`;
    }
    return statusParameter;

   case "created":
    let createdArray;
    //console.log(formData.selectedCreatedAt);
    if (formData.selectedCreatedAt.length > 0) {
     createdArray = [
      `filter[createdAt][gte]=${moment(formData.selectedCreatedAt[0]).format("YYYY-MM-DD")}`,
      `filter[createdAt][lte]=${moment(formData.selectedCreatedAt[1]).format("YYYY-MM-DD")}`
     ];
    } else {
     createdArray = [`filter[createdAt][gte]=`, `filter[createdAt][lte]=`];
    }
    let createdParameter = createdArray.join("&&");
    return createdParameter;
   default:
    return;
  }
 };

 useEffect(() => {
  cancelSource.current = CancelToken.source();
  if (JSON.parse(localStorage.getItem("withdraws")) !== null) {
   let retrievedFormData = JSON.parse(localStorage.getItem("withdraws"));
   if (retrievedFormData.selectedCreatedAt.length === 2) {
    let dateRange = [
     new Date(retrievedFormData.selectedCreatedAt[0]),
     new Date(retrievedFormData.selectedCreatedAt[1])
    ];
    retrievedFormData.selectedCreatedAt = dateRange;
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
 useEffect(() => {
  cancelSource2.current = CancelToken.source();
  localStorage.setItem("withdraws", JSON.stringify(formData));
  //console.log("useeffect", pagination);
  getFilteredData(1, pagination.size);
  return () => {
   cancelSource2.current.cancel();
  };
 }, [localStorage.getItem("withdraws")]);
 const search = () => {
  //console.log(formData);
  localStorage.setItem("withdraws", JSON.stringify(formData));
  getFilteredData(1, pagination.size);
 };
 const getFilteredData = (number, size) => {
  let createdParameter = getParameters("created");
  let uuidParameter = getParameters("uuid");
  let amountParameter = getParameters("amount");
  let bankRefNumParameter = getParameters("bankReferenceNumber");
  let statusParameter = getParameters("status");

  instance
   .get(
    `/withdraws.json?${createdParameter}&&${uuidParameter}&&${amountParameter}&&${bankRefNumParameter}&&${statusParameter}&&pagination[number]=${number}&&pagination[size]=${size}`
   )
   .then(res => {
    return (
     setTableData(res.data.withdraws),
     setPagination(res.data.pagination),
     setOption(res.data.option),
     setLoading(false)
     //console.log(res)
    );
   })
   .catch(err => console.log(err));
 };
 const currentPageChange = currentPage => {
  // setPagination({ ...pagination, number: currentPage });
  // let number = pagination.size;
  console.log(currentPage);
  getFilteredData(currentPage, pagination.size);
 };

 const pageSizeChange = pageSize => {
  setPagination({ ...pagination, size: pageSize });

  getFilteredData(1, pageSize);
 };
 const reset = () => {
  setFormData({
   uuid: null,
   amount: null,
   bankReferenceNumber: null,
   selectedStatus: [],
   selectedCreatedAt: []
  });
  localStorage.setItem("withdraws", JSON.stringify(null));
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
    <Form.Item label="Amount">
     <Layout.Col span="6">
      <Input
       placeholder="amount"
       value={formData.amount}
       onChange={onChange.bind(this, "amount")}
      />
     </Layout.Col>
    </Form.Item>
    <Form.Item label="Bank Reference Number">
     <Layout.Col span="6">
      <Input
       placeholder="Bank Reference Number"
       value={formData.bankReferenceNumber}
       onChange={onChange.bind(this, "bankReferenceNumber")}
      />
     </Layout.Col>
    </Form.Item>
    <Form.Item label="Status">
     <Layout.Col span="9">
      {option.status.length > 0 ? (
       <Checkbox.Group
        value={formData.selectedStatus}
        onChange={onChange.bind(this, "selectedStatus")}
       >
        {option.status.map(el => {
         return <Checkbox key={el} label={el} />;
        })}
       </Checkbox.Group>
      ) : (
       "Loading"
      )}
     </Layout.Col>
    </Form.Item>
    <Form.Item label="Created at">
     <Layout.Col span="6">
      <DatePick
       dateRange={formData.selectedCreatedAt}
       onChange={createdAt => setFormData({ ...formData, selectedCreatedAt: createdAt })}
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
