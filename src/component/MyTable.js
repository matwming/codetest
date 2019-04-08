import React from "react";
import { Loading, Pagination, Table } from "element-react";
import "element-theme-default";
const mytable = props => {
 return (
  <Loading text={props.text} loading={props.loading}>
   <Pagination
    layout="total, sizes, prev, pager, next, jumper"
    total={props.total_amount}
    pageSizes={[10, 20, 30, 40, 50]}
    pageSize={props.pageSize}
    currentPage={props.current_page}
    onCurrentChange={currentPage => {
     props.currentPageChange(currentPage);
    }}
    onSizeChange={pageSize => {
     props.pageSizeChange(pageSize);
    }}
   />
   <Table
    style={{ width: "100%" }}
    //rowClassName={this.rowClassName.bind(this)}
    columns={props.columns}
    data={props.data}
    border={true}
    height={650}
    onCellClick={props.onCellClick}
    onRowClick={props.onRowClick}
    rowClassName={props.rowClassName}
    onSelect={props.onSelect}
    onSelectAll={props.onSelectAll}
    onSelectChange={props.onSelectChange}
   />
  </Loading>
 );
};

export default mytable;
