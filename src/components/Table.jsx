import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Table, DatePicker, Button } from "antd";
import { parseISO, format } from "date-fns";
import dayjs from "dayjs";

import useDebounce from "../hooks/useDebounce";

export default function BlaiizTable() {
  const searchref = useRef();
  const { RangePicker } = DatePicker;

  const [text, setText] = useState("");

  const [totalCount, setTotalCount] = useState(null);

  const [filterObject, setFilterObject] = useState({ page: "0", count: "10" });

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const searchDebounce = useDebounce();

  const [page, setPage] = useState(parseInt(filterObject.page));

  const handleSearch = (e) => {
    setText(e.target.value);
    searchDebounce(() => {
      setFilterObject({
        ...filterObject,
        ...{ page: "0", search: e.target.value },
      });
    });
  };

  useEffect(() => {
    setPage(parseInt(filterObject.page));
  }, [filterObject]);

  useEffect(() => {
    setLoading(true);
    const filter_string = new URLSearchParams(filterObject).toString();
    axios
      .get(
        `https://free-user-api.onrender.com/api/user/get_all_users?${filter_string}`
      )
      .then((response) => {
        setTotalCount(response.data.results?.[0]?.total_users);
        setUserData(response.data.results?.[0]?.users);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data:", error);
      });
  }, [filterObject]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      filters: [
        { text: "Mr", value: "Mr" },
        { text: "Mrs", value: "Mrs" },
        { text: "Miss", value: "Miss" },
      ],
      render: (_, { name }) => (
        <span className="capitalize">{name?.title}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        const nameA = `${a.name.first} ${a.name.last}`.toUpperCase();
        const nameB = `${b.name.first} ${b.name.last}`.toUpperCase();
        return nameA.localeCompare(nameB);
      },
      render: (_, { name }) => (
        <>
          <span className="capitalize">{name.first} </span>
          <span className="capitalize">{name.last}</span>
        </>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => `${email}`,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
      ],
      render: (gender) => <span className="capitalize">{gender}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      filters: [
        { text: "United States", value: "United States" },
        { text: "Canada", value: "Canada" },
        { text: "Ukraine", value: "Ukraine" },
        { text: "Finland", value: "Finland" },
        { text: "United Kingdom", value: "United Kingdom" },
      ],
      render: (location) => (
        <>
          <span className="capitalize">{location.city}, </span>
          <span className="capitalize">{location.country}</span>
        </>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Date of birth",
      dataIndex: "dob",
      key: "dob",
      filterSearch: true,
      filters: [
        { text: "January", value: "January" },
        { text: "February", value: "February" },
        { text: "March", value: "March" },
        { text: "April", value: "April" },
        { text: "May", value: "May" },
        { text: "June", value: "June" },
        { text: "July", value: "July" },
        { text: "August", value: "August" },
        { text: "September", value: "September" },
        { text: "October", value: "October" },
        { text: "November", value: "November" },
        { text: "December", value: "December" },
      ],
      render: (_, { dob }) => `${format(parseISO(dob.date), "do MMMM, yyyy")}`,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.dob.age - b.dob.age,
      filters: [
        { text: "Under 20", value: "Under 20" },
        { text: "20-29", value: "20-29" },
        { text: "30-39", value: "30-39" },
        { text: "40-49", value: "40-49" },
        { text: "50 and above", value: "50 and above" },
      ],
      onFilter: (value, record) => {
        const age = record.dob.age;
        if (value === "Under 20") return age < 20;
        if (value === "20-29") return age >= 20 && age <= 29;
        if (value === "30-39") return age >= 30 && age <= 39;
        if (value === "40-49") return age >= 40 && age <= 49;
        if (value === "50 and above") return age >= 50;
        return false;
      },
      render: (_, { dob }) => `${dob.age}`,
    },
    {
      title: "Date Created",
      dataIndex: "date_created",
      key: "date_created",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            value={selectedKeys[0]}
            onChange={(dates) => setSelectedKeys(dates ? [dates] : [])}
            style={{ marginBottom: 10, display: "flex" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            style={{ marginRight: 8 }}
          >
            Apply
          </Button>
          <Button type="default" onClick={() => clearFilters()}>
            Reset
          </Button>
        </div>
      ),
      render: (_, { createdAt }) =>
        `${format(parseISO(createdAt), "dd/MM/yyyy")}`,
    },
  ];

  // handlepagechange
  const handlePageChange = (page) => {
    setFilterObject({ ...filterObject, ...{ page: String(page - 1) } });
  };

  // handle per rows change
  const handlePerRowsChange = async (newPerPage, page) => {
    setFilterObject((prev) => ({
      ...prev,
      page: String(page),
      count: String(newPerPage),
    }));
  };

  return (
    <>
      <div className="mb-5 flex gap-x-2 justify-end">
        <div className="relative" ref={searchref}></div>
        <input
          type="text"
          value={text}
          disabled={false}
          onChange={handleSearch}
          className="bg-white w-60 p-1 border-[1px] border-[#9CA3AF] rounded outline-none text-sm placeholder:text-sm text-[#36454F] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={`Search by name, email, location`}
        />
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={userData}
        pagination={{
          defaultPageSize: 10,
          total: totalCount,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          current: page + 1,
          showSizeChanger: true,
          pageSizeOptions: ["10", "15", "20", "30"],
          onChange: (page, pageSize) => {
            handlePageChange(page - 1);
            handlePerRowsChange(pageSize, page - 1);
          },
        }}
        loading={loading}
        onChange={(pagination, filters, sorter) => {
          const selectedDateRange = filters?.date_created?.[0];
          const startDate =
            filters?.date_created?.length > 0
              ? dayjs(selectedDateRange?.[0]).format("YYYY-MM-DD")
              : "";
          const endDate =
            filters?.date_created?.length > 0
              ? dayjs(selectedDateRange?.[1]).format("YYYY-MM-DD")
              : "";

          const sortOrderMap = {
            ascend: "ascending",
            descend: "descending",
          };

          const age_sort =
            sorter?.field === "age" ? sortOrderMap[sorter?.order] || "" : "";

          const name_sort =
            sorter?.field === "name" ? sortOrderMap[sorter?.order] || "" : "";

          setFilterObject((prev) => ({
            ...prev,
            title: (filters?.title || [])?.join(","),
            gender: (filters?.gender || [])?.join(","),
            location: (filters?.location || [])?.join(","),
            dob: (filters?.dob || [])?.join(","),
            age: (filters?.age || [])?.join(","),
            start_date: startDate,
            end_date: endDate,
            age_sort: age_sort,
            name_sort: name_sort,
          }));
        }}
        scroll={{ x: "1100px" }}
      />
    </>
  );
}
