import "amazon-connect-streams";
import {
  createDetailsWidget,
  createMessageBoxWidget,
  createFullscreenWidget,
} from "@livechat/agent-app-sdk";
import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const containerDiv = useRef();

  useEffect(() => {
    console.log("Mounted");

    try {
      // eslint-disable-next-line no-undef
      connect.core.initCCP(containerDiv.current, {
        ccpUrl: "https://democxengage.my.connect.aws/ccp-v2/",
        loginPopup: true, // optional, defaults to `true`
        loginPopupAutoClose: true, // optional, defaults to `false`
        loginOptions: {
          // optional, if provided opens login in new window
          autoClose: true, // optional, defaults to `false`
          height: 600, // optional, defaults to 578
          width: 350, // optional, defaults to 433
          top: 0, // optional, defaults to 0
          left: 0, // optional, defaults to 0
        },
        region: "af-south-1", // REQUIRED for `CHAT`, optional otherwise
        softphone: {
          // optional, defaults below apply if not provided
          allowFramedSoftphone: true, // optional, defaults to false
          disableRingtone: false, // optional, defaults to false
          // ringtoneUrl: "/dj_hi_hat_sample.mp3", // optional, defaults to CCP’s default ringtone if a falsy value is set
          allowFramedVideoCall: true, // optional, default to false
          allowEarlyGum: true, //optional, default to true
        },
        pageOptions: {
          //optional
          enableAudioDeviceSettings: true, //optional, defaults to 'false'
          enableVideoDeviceSettings: true, //optional, defaults to 'false'
          enablePhoneTypeSettings: true, //optional, defaults to 'true'
        },
        shouldAddNamespaceToLogs: true, //optional, defaults to 'false'
        ccpAckTimeout: 5000, //optional, defaults to 3000 (ms)
        ccpSynTimeout: 3000, //optional, defaults to 1000 (ms)
        ccpLoadTimeout: 10000, //optional, defaults to 5000 (ms)
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onCustomerProfile = function (profile) {
    console.log("Profile", profile);
  };

  useEffect(() => {
    console.log("Loading widget");
    let widget, fWidget, mWidget;
    createDetailsWidget().then((w) => {
      console.log("Loaded widget");
      widget = w;
      widget.on("customer_profile", onCustomerProfile);
    });

    createMessageBoxWidget.then((w) => {
      console.log("Loaded MessageBoxWidget");
      fWidget = w;
    });

    createFullscreenWidget.then((w) => {
      console.log("Loaded FullscreenWidget");
      mWidget = w;
    });

    return () => {
      if (widget) {
        console.log("Cleanup widget");
        widget.off("customer_profile", onCustomerProfile);
      }
    };
  }, []);

  return (
    <div className="App">
      <div
        id="container-div"
        ref={containerDiv}
        style={{ width: "350px", height: "600px" }}
      ></div>
    </div>
  );
}

export default App;
