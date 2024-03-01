import "amazon-connect-streams";
import { createDetailsWidget } from "@livechat/agent-app-sdk";
import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const containerDiv = useRef();

  

  useEffect( () => {
    console.log("Mounted");

    try {
      // eslint-disable-next-line no-undef
      connect.core.initCCP(containerDiv.current, {
        ccpUrl: "https://democxengage.my.connect.aws/ccp-v2/",
        loginPopup: true,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect( () => {
    async function createWidget(){
      createDetailsWidget().then(widget => {
        function onCustomerProfile(profile) {
          console.log(profile)
        }
      
        widget.on("customer_profile", onCustomerProfile);
        widget.off("customer_profile", onCustomerProfile);
      });
    }
    createWidget()
  }, [])

  return (
    <div className="App">
      <div id="container-div" ref={containerDiv} style={{width: "400px", height:"600px"}}></div>
    </div>
  );
}

export default App;
