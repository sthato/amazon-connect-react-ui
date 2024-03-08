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
    let widget, fWidget, mWidget;

    try {
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

      connect.core.onAuthFail(function () {
        console.log("agent logged out or session expired.  needs login");
      });

      connect.core.onIframeRetriesExhausted(() => {
        console.log("We have run out of retries to reload the CCP Iframe");
      });

      connect.core.onAuthorizeSuccess(() => {
        console.log("authorization succeeded! Hooray");
      });

      connect.core.onCTIAuthorizeRetriesExhausted(() => {
        console.log(
          "We have failed CTI API authorization multiple times and we are out of retries"
        );
      });

      connect.core.onAuthorizeRetriesExhausted(() => {
        console.log(
          "We have failed the agent authorization api multiple times and we are out of retries"
        );
      });

      console.log("Loading widget");

      createDetailsWidget().then((w) => {
        console.log("Loaded widget");
        widget = w;
        widget.on("customer_profile", (profile) => {
          widget.putMessage("Hello, " + profile.name).then(() => {});

          if (profile?.name === "Thato Shebe") {
            console.log("Modifying Section");
            widget
              .modifySection({
                title: "Connect Actions",
                components: [
                  {
                    type: "button",
                    data: {
                      label: "Call " + profile.name,
                      id: "call-button",
                    },
                  },
                ],
              })
              .then(() => {
                console.log("Section Updated");
              });
          }
        });
        widget.on("customer_details_section_button_click", ({ buttonId }) => {
          console.log("Button with id", buttonId, "clicked");

          const agent = new connect.Agent();
          if (buttonId === "call-button") {
            
            try {
              const state = agent.getState();
              console.log(
                "Current agent state",
                state,
                "duration",
                agent.getStateDuration()
              );
              if (agent.isSoftphoneEnabled()) {
                const endpoint = connect.Endpoint.byPhoneNumber("+27684626072");
                const queueArn =
                  "arn:aws:connect:af-south-1:858917309331:instance/b90b9e78-1775-4e3d-adeb-bd2f049b7031/queue/618c4d14-a1f7-4574-b627-509171376070";

                agent.connect(endpoint, {
                  // queueARN: queueArn,
                  success: function () {
                    console.log("outbound call connected");
                    widget
                      .modifySection({
                        title: "Connect Actions",
                        components: [
                          {
                            type: "button",
                            data: {
                              label: "Mute call",
                              id: "mute-button",
                            },
                          },
                          {
                            type: "button",
                            data: {
                              label: "End call",
                              id: "end-button",
                            },
                          },
                          
                        ],
                      })
                      .then(() => {
                        console.log("Section Updated");
                      });
                    
                  },
                  failure: function (err) {
                    console.log("outbound call connection failed");
                    console.log(err);
                  },
                });
              }
            } catch (error) {}
          }
          else if (buttonId === "end-button"){
            const contacts = agent.getContacts();
            
            console.log("contacts", contacts)
            console.log("Countries", agent.getDialableCountries());
            console.log("QueueARns",  agent.getAllQueueARNs());
            console.log("PErmissions", agent.getPermissions());
            vonsole.log("States", agent.getAgentStates())
            // const contactId = contacts[0].getContactId();
            contacts[0].clear({
              success: function(){console.log("Contact cleared")},
              failure: () => {console.error("Failed to clear contact")}
            })
          } else if(buttonId === "mute-button"){
            agent.mute();
            widget
                      .modifySection({
                        title: "Connect Actions",
                        components: [
                          {
                            type: "button",
                            data: {
                              label: "Unute call",
                              id: "unmute-button",
                            },
                          }
                          
                        ],
                      })
                      .then(() => {
                        console.log("Section Updated");
                      });
          }
        else if(buttonId === "unmute-button"){
          agent.unmute();
          widget
                    .modifySection({
                      title: "Connect Actions",
                      components: [
                        {
                          type: "button",
                          data: {
                            label: "Mute call",
                            id: "mute-button",
                          },
                        },{
                          type: "button",
                          data: {
                            label: "End call",
                            id: "end-button",
                          },
                        },
                        
                      ],
                    })
                    .then(() => {
                      console.log("Section Updated");
                    });
        }
        });
      });

      createMessageBoxWidget.then((w) => {
        console.log("Loaded MessageBoxWidget");
        fWidget = w;
        console.log(fWidget);
      });

      createFullscreenWidget.then((w) => {
        console.log("Loaded FullscreenWidget");
        mWidget = w;
        console.log(mWidget);
      });
    } catch (error) {
      console.error("AppError", error);
    }
    return () => {
      if (widget) {
        console.log("Cleanup widget");
        widget.off("customer_profile", onCustomerProfile);
      }
    };
  }, []);

  const onCustomerProfile = function (profile) {
    console.log("Profile", profile);
  };

  useEffect(() => {}, []);

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
