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
          getValue={() => tempSelection.length > 1 
            ? [{ label: `${tempSelection.length} items selected`, value: "count" }] 
            : tempSelection
          }
        />
