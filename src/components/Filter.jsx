//components
import close from "../assets/close.svg";

import { Checkbox, Radio, DatePicker, Button } from "antd";
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

const titleOptions = ["Mr", "Mrs", "Miss"];
const genderOptions = ["Male", "Female"];
const locationOptions = [
  "United States",
  "Canada",
  "Ukraine",
  "Finland",
  "United Kingdom",
];
const dobOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Filter = ({
  setShowFilter,
  titleFilters,
  setTitleFilters,
  genderFilters,
  setGenderFilters,
  locationFilters,
  setLocationFilters,
  nameSort,
  setNameSort,
  ageSort,
  setAgeSort,
  setDateFilter,
  dateOption,
  setDateOption,
  handleSubmit,
  dobFilters,
  setDobFilters,
  handleResetFilter
}) => {
  const titleOnChange = (list) => setTitleFilters(list);
  const genderOnChange = (list) => setGenderFilters(list);
  const locationOnChange = (list) => setLocationFilters(list);
  const dobOnChange = (list) => setDobFilters(list);
  const onNameSortChange = (e) => setNameSort(e.target.value);
  const onAgeSortChange = (e) => setAgeSort(e.target.value);
  const onDateChange = (dates, dateStrings) => {
    setDateFilter(dateStrings); 
    setDateOption(dates)
  };

  return (
    <div className="bg-white shadow-xl p-3 rounded text-[#36454F] w-[400px] border-[1px] border-[#E5E7EB]">
      <div className="flex justify-between items-center pb-1 border-b-[1px] border-gray-100">
        <p>Filter By</p>
        <img
          src={close}
          alt="close"
          onClick={() => setShowFilter(false)}
          className="cursor-pointer"
        />
      </div>
      <div className="mt-3 border-b-[1px] border-gray-100">
        <p className="text-xs text-[#36454F] mb-1">Title</p>
        <div className="pb-2">
          <CheckboxGroup
            options={titleOptions}
            value={titleFilters}
            onChange={titleOnChange}
          />
        </div>
      </div>
      <div className="mt-3 border-b-[1px] border-gray-100">
        <p className="text-xs text-[#36454F] mb-1">Gender</p>
        <div className="pb-2">
          <CheckboxGroup
            options={genderOptions}
            value={genderFilters}
            onChange={genderOnChange}
          />
        </div>
      </div>
      <div className="mt-3 border-b-[1px] border-gray-100">
        <p className="text-xs text-[#36454F] mb-1">Location</p>
        <div className="pb-2">
          <CheckboxGroup
            options={locationOptions}
            value={locationFilters}
            onChange={locationOnChange}
          />
        </div>
      </div>
      <div className="mt-3 border-b-[1px] border-gray-100">
        <p className="text-xs text-[#36454F] mb-1">Month of Birth</p>
        <div className="pb-2">
          <CheckboxGroup
            options={dobOptions}
            value={dobFilters}
            onChange={dobOnChange}
          />
        </div>
      </div>
      <div className="mt-3 border-b-[1px] border-gray-100">
        <p className="text-xs text-[#36454F] mb-1">Sort Name</p>
        <div className="pb-2">
          <Radio.Group onChange={onNameSortChange} value={nameSort}>
            <Radio value={"ascending"}>Ascending</Radio>
            <Radio value={"descending"}>Descending</Radio>
            <Radio value={""}>None</Radio>
          </Radio.Group>
        </div>
      </div>
      <div className="mt-3 border-b-[1px] border-gray-100">
        <p className="text-xs text-[#36454F] mb-1">Sort Age</p>
        <div className="pb-2">
          <Radio.Group onChange={onAgeSortChange} value={ageSort}>
            <Radio value={"ascending"}>Ascending</Radio>
            <Radio value={"descending"}>Descending</Radio>
            <Radio value={""}>None</Radio>
          </Radio.Group>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-[#36454F] mb-1">Date Created</p>
        <div className="pb-2">
          <RangePicker onChange={onDateChange} value={dateOption} />
        </div>
      </div>
      <div className="mt-5 border-t-[1px] border-gray-100">
        <div className="flex items-center pt-4 gap-x-4">
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit();
            }}
          >
            Apply
          </Button>
          <Button type="dashed" onClick={() => handleResetFilter()}>Reset</Button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
