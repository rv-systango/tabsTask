import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import SelectionComponent from "./components/SelectionComponent";
import dataJSON from "./assets/data/data.json";
import "./App.css";

export default function App() {
  const [value, setValue] = React.useState("1");
  const permissions = dataJSON.permissions;

  const handleChange = (s, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="container-div">
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Item One" value="1" />
            <Tab label="Item Two" value="2" />
            <Tab label="Item Three" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <SelectionComponent
            data={permissions}
            keys={["permission", "description"]}
          />
        </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </div>
  );
}
