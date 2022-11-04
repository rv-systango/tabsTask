import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import SelectionComponent from "./components/SelectionComponent";
import dataJSON from "./assets/data/data.json";
import "./App.css";
import MultiSelection from "./components/MultiSelection";

export const AppContext = React.createContext();
export default function App() {
  const [appState, setAppState] = React.useState({
    permissions: [],
    members: [],
    advertiser: []
  });
  const [value, setValue] = React.useState("1");
  const permissions = dataJSON.permissions;
  const members = dataJSON.members;
  const advertiser = dataJSON.advertiser;

  const handleChange = (s, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="container-div">
      <AppContext.Provider value={{ appState, setAppState }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Permissions" value="1" />
              <Tab label="Members" value="2" />
              <Tab label="Advertiser Access" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <SelectionComponent
              data={permissions}
              keys={["permission", "description"]}
              appstate_key="permissions"
            />
          </TabPanel>
          <TabPanel value="2">
            <SelectionComponent
              data={members}
              keys={["email", "firstname", "lastname"]}
              appstate_key="members"
            />
          </TabPanel>
          <TabPanel value="3">
            <MultiSelection
              data={advertiser}
              keys={["advertiser", "description"]}
              appstate_key="advertiser"
            />
          </TabPanel>
        </TabContext>
      </AppContext.Provider>
    </div>
  );
}
