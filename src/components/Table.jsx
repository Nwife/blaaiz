import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Table } from "antd";
import { parseISO, format } from "date-fns";

import caret from "../assets/caret.svg";

const CustomSelect = ({
  options,
  searchParameter,
  setSearchParameter,
  setShowSelect,
  setText,
}) => {
  return (
    <div>
      {options.map((option, idx) => (
        <p
          key={option.value}
          className={`p-2 cursor-pointer ${
            idx === 0
              ? "bg-[#f4f4f4] text-[#c1c2c2]"
              : searchParameter === option.value
              ? "bg-[#F0F5FF] text-[#1D39C4]"
              : "text-[#1F2937]"
          } rounded`}
          onClick={() => {
            setSearchParameter(option.value);
            setShowSelect(false);
            setText("");
          }}
        >
          {option.label}
        </p>
      ))}
    </div>
  );
};

export default function BlaiizTable() {
  const searchref = useRef();

  const [text, setText] = useState("");
  const [showSelect, setShowSelect] = useState(false);
  const [searchParameter, setSearchParameter] = useState("<select option>");

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    pageSizeOptions: ["10", "20", "30", "40"],
    showSizeChanger: true,
  });

  const search_options = [
    { value: "<select option>", label: "<select option>" },
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "location", label: "Location" },
  ];

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://randomuser.me/api/?results=65&seed=abc&nat=us,ca,ua,fi,gb")
      .then((response) => {
        setUserData(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data:", error);
      });
  }, []);

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
      onFilter: (value, record) => record.name.title === value,
      render: (_, { name }) => `${name?.title}`,
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
      render: (_, { name }) => `${name.first} ${name.last}`,
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
      onFilter: (value, record) => record.gender === value,
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
      onFilter: (value, record) => record.location.country === value,
      render: (location) => `${location.city}, ${location.country}`,
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
      onFilter: (value, record) => {
        const dobDate = record.dob.date;
        const month = format(parseISO(dobDate), "MMMM");
        
        return month === value;
      },

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
  ];

  const handleTableChange = (newPagination) => {
    setLoading(true);
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const filteredData = userData?.filter((item) => {
    if (searchParameter === "<select option>") {
      return userData;
    }
    if (searchParameter === "name") {
      return `${item.name.first} ${item.name.last}`
        .toLowerCase()
        .includes(text.toLowerCase());
    }
    if (searchParameter === "email") {
      return `${item.email}`.toLowerCase()?.includes(text.toLowerCase());
    }
    if (searchParameter === "location") {
      return `${item.location.city}, ${item.location.country}`
        .toLowerCase()
        .includes(text.toLowerCase());
    }
  });

  //creating the click outside to close drop down effect
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu, then close the menu
      if (
        setShowSelect &&
        searchref.current &&
        !searchref.current.contains(e.target)
      ) {
        setShowSelect(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [setShowSelect]);

  return (
    <>
      <div className="mb-5 flex gap-x-2 justify-end">
        <div className="relative" ref={searchref}>
          <div
            className="flex items-center gap-x-2 px-4 py-1.5 border-solid border-[1px] bg-white border-[#9CA3AF] rounded w-fit cursor-pointer"
            onClick={() => setShowSelect(!showSelect)}
          >
            <p className="text-sm text-[#36454F] capitalize">
              {searchParameter}
            </p>
            <span>
              <img src={caret} alt="" />
            </span>
          </div>
          {showSelect && (
            <div className="absolute w-[160px] p-1 text-sm black-text-3 bg-white shadow-[1px_4px_12px_-1px_rgba(44,78,39,0.15)] rounded z-10">
              {showSelect && (
                <CustomSelect
                  options={search_options}
                  searchParameter={searchParameter}
                  setSearchParameter={setSearchParameter}
                  setShowSelect={setShowSelect}
                  setText={setText}
                />
              )}
            </div>
          )}
        </div>
        <input
          type="text"
          value={text}
          disabled={searchParameter === "<select option>" ? true : false}
          onChange={(e) => setText(e.target.value)}
          className="bg-white w-60 p-1 border-[1px] border-[#9CA3AF] rounded outline-none text-sm placeholder:text-sm text-[#36454F] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={`Search by ${searchParameter}`}
        />
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record.login.uuid}
        dataSource={filteredData}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: "1100px" }}
      />
    </>
  );
}
