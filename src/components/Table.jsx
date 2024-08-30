import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Table } from "antd";
import { parseISO, format } from "date-fns";

import useDebounce from "../hooks/useDebounce";
import filtericon from "../assets/filter.svg";
import Filter from "./Filter";

export default function BlaiizTable() {
  const filterRef = useRef();
  const [text, setText] = useState("");
  const [totalCount, setTotalCount] = useState(null);
  const [filterObject, setFilterObject] = useState({ page: "0", count: "10" });

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const [showFilter, setShowFilter] = useState(false);

  const searchDebounce = useDebounce();

  const [page, setPage] = useState(parseInt(filterObject.page));

  const [titleFilters, setTitleFilters] = useState([]);
  const [genderFilters, setGenderFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [dobFilters, setDobFilters] = useState([]);
  const [nameSort, setNameSort] = useState("");
  const [ageSort, setAgeSort] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [dateOption, setDateOption] = useState(null);
  const [isActive, setIsActive] = useState(false);

  // console.log("titleFilter>>>", titleFilters);
  // console.log("genderFilter>>>", genderFilters);
  // console.log("locationFilter>>>", locationFilters);
  // console.log("nameSort>>>", nameSort);
  // console.log("ageSort>>>", ageSort);
  // console.log("dateFilter>>>", dateFilter);

  console.log("isActive>>>", isActive);

  const handleSubmit = () => {
    setFilterObject((prev) => ({
      ...prev,
      page: "0",
      title: titleFilters?.join(","),
      gender: genderFilters?.join(","),
      location: locationFilters?.join(","),
      dob: dobFilters?.join(","),
      start_date: dateFilter?.[0] ? dateFilter?.[0] : "",
      end_date: dateFilter?.[1] ? dateFilter?.[1] : "",
      age_sort: ageSort,
      name_sort: nameSort,
    }));
    setShowFilter(false);
  };

  const handleResetFilter = () => {
    setTitleFilters([]);
    setGenderFilters([]);
    setLocationFilters([]);
    setDobFilters([]);
    setNameSort("");
    setAgeSort("");
    setDateFilter(null);
    setDateOption(null);
  };

  useEffect(() => {
    if (
      titleFilters?.length > 0 ||
      genderFilters?.length > 0 ||
      locationFilters?.length > 0 ||
      dobFilters?.length > 0 ||
      nameSort?.length > 0 ||
      ageSort?.length > 0 ||
      dateFilter?.length > 0
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [
    titleFilters,
    genderFilters,
    locationFilters,
    dobFilters,
    nameSort,
    ageSort,
    dateFilter,
  ]);

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
      render: (_, { name }) => (
        <span className="capitalize">{name?.title}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      render: (gender) => <span className="capitalize">{gender}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
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
      render: (_, { dob }) => `${format(parseISO(dob.date), "do MMMM, yyyy")}`,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (_, { dob }) => `${dob.age}`,
    },
    {
      title: "Date Created",
      dataIndex: "date_created",
      key: "date_created",
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

  //click outside
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu, then close the menu
      if (
        showFilter &&
        filterRef.current &&
        !filterRef.current.contains(e.target)
      ) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showFilter]);

  return (
    <>
      <div className="mb-5 flex gap-x-2 justify-end relative w-max ml-auto">
        <div className="flex items-start gap-x-1">
          {isActive && <div className="h-2 w-2 rounded-full bg-blue-500" />}
          <div
            className="flex items-center gap-x-2 p-1 pl-2 border-[1px] rounded text-[#36454F] text-sm border-[#9CA3AF] bg-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowFilter(!showFilter);
            }}
          >
            <p>Filter</p>
            <span>
              <img src={filtericon} alt="filter_icon" />
            </span>
          </div>
        </div>
        <input
          type="text"
          value={text}
          disabled={false}
          onChange={handleSearch}
          className="bg-white w-60 p-1 border-[1px] border-[#9CA3AF] rounded outline-none text-sm placeholder:text-sm text-[#36454F] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={`Search by name, email, location`}
        />
        {showFilter && (
          <div className="absolute top-12 z-10">
            <Filter
              setShowFilter={setShowFilter}
              titleFilters={titleFilters}
              setTitleFilters={setTitleFilters}
              genderFilters={genderFilters}
              setGenderFilters={setGenderFilters}
              locationFilters={locationFilters}
              setLocationFilters={setLocationFilters}
              dobFilters={dobFilters}
              setDobFilters={setDobFilters}
              nameSort={nameSort}
              setNameSort={setNameSort}
              ageSort={ageSort}
              setAgeSort={setAgeSort}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              dateOption={dateOption}
              setDateOption={setDateOption}
              handleSubmit={handleSubmit}
              handleResetFilter={handleResetFilter}
            />
          </div>
        )}
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
        scroll={{ x: "1100px" }}
      />
    </>
  );
}
