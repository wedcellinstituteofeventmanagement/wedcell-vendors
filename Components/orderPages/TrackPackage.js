import React from "react";
import Styles from "../../styles/Dashboard/Dashboard.module.css";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { PROXY } from "../../config";
// import { ProgressBar, Step } from "react-step-progress-bar";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import useWindowSize from "@rooks/use-window-size";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Style } from "@mui/icons-material";
import { selectUser } from "../../redux/reducer/appEssentials";
import moment from "moment";
const TrackPackage = ({
  order,
  setOrderStatus,
  setCancelOrder,
  setTrackPackage,
}) => {
  const globleuser = useSelector(selectUser);
  const router = useRouter();
  const ostat = [
    "Processing",
    "OrderComplete",
    "OrderCancel",
    "CancelRefund",
    "ReturnOrder",
  ];
  const [openCancleorder, setopencancelOrder] = useState(false);

  // useEffect(() => {
  //   !globleuser.success && router.push("/");
  // }, []);
  const {
    innerWidth: windowWidth,
    innerHeight,
    outerHeight,
    outerWidth,
  } = useWindowSize();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(false);

  function step2Validator() {
    // return a boolean
  }

  function step3Validator() {
    // return a boolean
  }
  const oc = "26 jan, 2023";
  const sc = "28 jan, 2023";
  const od = "28 jan, 2023";
  const de = "29 jan, 2023";
  const steps = [
    ["Order Confirmed", <br />, oc],
    ["Shipped", , <br />, sc],
    ["Out For Delivery", , <br />, od],
    ["Delivered", , <br />, de],
  ];
  const steps1 = [
    ["Order Cancelled", <br />, oc],
    ["Refund Initialized", , <br />, sc],
    ["Refund Completed", , <br />, od],
  ];
  const steps3 = [
    ["Return Initiated", <br />, oc],
    ["Recieved by Vendor", , <br />, sc],
    ["Shipped by Vendor", , <br />, sc],
    ["Out For Delivery", , <br />, od],
    ["Delivered", , <br />, de],
  ];
  const cancelOrder = async (id, mode, paymentId, amount) => {
    // e.preventDefault()
    const res = await axios.post(
      `${PROXY}/api/v1/cancel`,
      {
        id: id,
        mode: mode,
        paymentId: paymentId,
        amount: amount,
      },
      {
        headers: {
          authorization: globleuser?.data?.token,
        },
      }
    );
    if (res.data.success) {
      window.alert("Cancellation successful");
      setTrackPackage(false);
      // setCancelOrder(true)
    } else {
      window.alert("Cancellation error");
    }
  };
  return (
    <>
      {windowWidth >= 560 ? (
        <>
          <div className={Styles.orderbtndates}>
            <div className={Styles.orderIdAndButton}>
              <span>Order ID : {order._id}</span>
              <div className={Styles.btndivorderTrack}>
                <button
                  className={Styles.cancelOrder}
                  onClick={(e) =>
                    cancelOrder(
                      order._id,
                      order.paymentMode,
                      order.paymentId,
                      order.amount
                    )
                  }
                >
                  Cancel Order
                </button>
                <button
                  className={Styles.TrackOrder}
                  onClick={() => setTrackPackage(false)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5" // Adjust the stroke width to make the icon smaller
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="20" // Adjust the width to make the icon smaller
                      height="20" // Adjust the height to make the icon smaller
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span style={{ fontSize: "16px", marginLeft: "8px" }}>
                      Go back
                    </span>
                  </div>
                </button>
              </div>
            </div>
            <div className={Styles.Dates}>
              <span className={Styles.OrderDate}>
                Order date :{" "}
                <span className={Styles.ActualDate}>
                  {moment(order?.createdAt).format("MMM DD YYYY")}
                </span>
              </span>
              <div className={Styles.estimatedDeldiv}>
                <img
                  src="https://wedcell.s3.ap-south-1.amazonaws.com/vendors/images/truck-tick.png"
                  alt=""
                />
                <span className={Styles.estimatedSpan}>
                  {order.orderStatus == "Processing" && (
                    <span className={Styles.estimatedSpan}>
                      Estimated delivery:{" "}
                      {moment(order?.createdAt).add(5, "days").format("DD MMM")}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className={Styles.middleDiv}>
            <div
              style={{
                marginBottom: "30px",
                padding: "50px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Stepper
                activeStep={1}
                alternativeLabel
                style={{ width: "100%", fontSize: "18px" }}
              >
                {steps?.map((label) => (
                  <Step key={label}>
                    <StepLabel>
                      {" "}
                      <span
                        style={{
                          fontSize: "18px",
                          fontFamily: "Ledger",
                        }}
                      >
                        {label}
                      </span>{" "}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
            <div className={Styles.OrderDetaildiv}>
              <div className={Styles.BasicDetails}>
                <img src={order.image} alt="" />
                <div className={Styles.basicWriteen}>
                  <span className={Styles.Ordername}>{order.productName}</span>
                  <span className={Styles.basicCat}>{order.size}</span>
                </div>
              </div>
              <div className={Styles.ammountAndqty}>
                <span className={Styles.Amount}>₹{order.amount / 100}</span>
                <span className={Styles.qty}>Qty : {order.quantity}</span>
              </div>
            </div>
          </div>
          <div className={Styles.FinalDiv}>
            <div className={Styles.DelAndMopdiv}>
              <span className={Styles.body}>
                {order.shippingAddress.name}
                <br />
                {order.shippingAddress.address1 +
                  ", " +
                  order.shippingAddress.address2 +
                  ", " +
                  order.shippingAddress.city +
                  " PIN-" +
                  order.shippingAddress.pincode +
                  ", " +
                  order.shippingAddress.state +
                  ", " +
                  order.shippingAddress.country}
              </span>
            </div>
            <div className={Styles.DelAndMopdiv}>
              <span className={Styles.heads}>Payment method</span>
              <span className={Styles.body}>
                {order.paymentMode}
                <br />
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={Styles.orderbtndates}>
            <div className={Styles.orderIdAndButton1}>
              <div className={Styles.orderStatusAndId}>
                <span style={{ color: "#B72E5A" }}>Order inProgress</span>
                <span>Order ID : {order._id}</span>
              </div>
              <div className={Styles.OrderDate1}>
                <span>Order Date</span>
                <span>{moment(order?.createdAt).format("MMM DD YYYY")}</span>
              </div>
            </div>
            <div className={Styles.Dates}>
              <div className={Styles.estimatedDeldiv}>
                <img
                  src="https://wedcell.s3.ap-south-1.amazonaws.com/vendors/images/truck-tick.png"
                  alt=""
                />
                {order.orderStatus == "Processing" && (
                  <span className={Styles.estimatedSpan}>
                    Estimated delivery:{" "}
                    {moment(order?.createdAt).add(5, "days").format("DD MMM")}
                  </span>
                )}
              </div>
            </div>
            <div className={Styles.btndivorderTrack}>
              {
                <button
                  className={Styles.cancelOrder}
                  onClick={(e) =>
                    cancelOrder(
                      order._id,
                      order.paymentMode,
                      order.paymentId,
                      order.amount
                    )
                  }
                >
                  Cancel Order
                </button>
              }
              <button
                className={Styles.TrackOrder}
                onClick={() => setTrackPackage(false)}
              >
                View Order
              </button>
            </div>
          </div>
          <div className={Styles.middleDiv}>
            <div
              style={{
                marginBottom: "30px",
                padding: "10px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Stepper
                activeStep={1}
                // alternativeLabel
                style={{
                  width: "100%",
                  fontSize: "18px",
                  height: "100%",
                }}
                orientation="vertical"
              >
                {steps?.map((label) => (
                  <Step key={label}>
                    <StepLabel>
                      {" "}
                      <span
                        style={{
                          fontSize: "16px",
                          fontFamily: "Ledger",
                        }}
                      >
                        {label}
                      </span>{" "}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
            <div className={Styles.OrderDetaildiv}>
              <span className={Styles.YourOrderspan}>Your Order</span>
              <div className={Styles.BasicDetails}>
                <img
                  src="https://wedcell.s3.ap-south-1.amazonaws.com/vendors/images/Gifts.png"
                  alt=""
                />
                <div className={Styles.basicWriteen}>
                  <span className={Styles.Ordername}>{order.productName}</span>
                  <span className={Styles.basicCat}>Size : Small</span>
                  <span className={Styles.basicCat}>
                    Price :{" "}
                    <span style={{ fontSize: "16px", fontWeight: "600" }}>
                      ₹{order.amount / 100}
                    </span>
                  </span>
                  <span className={Styles.basicCat}>
                    Qty : {order.quantity}
                  </span>
                </div>
              </div>
              {/* <div className={Styles.ammountAndqty}>
                    <span className={Styles.Amount}>₹{order.amount/100}</span>
                    <span className={Styles.qty}>Qty : {order.quantity}</span>
                  </div> */}
            </div>
          </div>
          <div className={Styles.FinalDiv}>
            <div className={Styles.DelAndMopdiv}>
              <span className={Styles.body}>
                {order.shippingAddress.name}
                <br />
                {order.shippingAddress.address1 +
                  ", " +
                  order.shippingAddress.address2 +
                  ", " +
                  order.shippingAddress.city +
                  " PIN-" +
                  order.shippingAddress.pincode +
                  ", " +
                  order.shippingAddress.state +
                  ", " +
                  order.shippingAddress.country}
              </span>
            </div>
            <div className={Styles.DelAndMopdiv}>
              <span className={Styles.heads}>Payment method</span>
              <span className={Styles.body}>
                {order.paymentMode}
                <br />
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TrackPackage;
