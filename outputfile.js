const MultiValueContainer = ({ selectProps, data }) => {
  const count = selectProps.value.length;
  return count > 1 ? (
    <div className="selected-count-text">{count} items selected</div>
  ) : (
    <div>{data.label}</div>
  );
};

<Select
          isMulti
          options={options}
          value={tempSelection}
          onChange={setTempSelection}
          className="select-box"
          placeholder="Select Options"
          closeMenuOnSelect={false}
          isClearable
          hideSelectedOptions={false}
          components={{ MultiValueContainer }}
        />
