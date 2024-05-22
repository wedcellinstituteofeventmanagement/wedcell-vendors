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
const RefundOrder = ({
  order,
  setOrderStatus,
  setrefundOrder,
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
  const [orders, setOrders] = useState([]);
  const [cancelOrder, setCancelOrder] = useState(false);
  const [returnOrder, setReturnOrder] = useState(false);
  const getOrders = async () => {
    const res = await axios.get(`${PROXY}/order/user/get`, {
      headers: {
        authorization: globleuser?.data?.token,
      },
    });
    setOrders(res.data);
  };
  const cancel_order = async (id, mode, paymentId, amount) => {
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
    setopencancelOrder(true);
    // setCancelOrder(true)
  };
  // useEffect(() => {
  //   getOrders();
  // }, [globleuser]);

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
  return (
    <>
      {windowWidth > 560 ? (
        <>
          <div
            style={{
              borderBottom: "1px solid gray",
              paddingBottom: "10px",
              fontFamily: "Ledger",
            }}
          >
            <h2>Refund Status</h2>
          </div>
          <div className={Styles.orderbtndates}>
            <div
              className={Styles.orderIdAndButton}
              style={{ fontSize: "17px" }}
            >
              <div className={Styles.Dates}>
                <span className={Styles.OrderDate} style={{ fontSize: "19px" }}>
                  Order date :{" "}
                  <span
                    className={Styles.ActualDate}
                    style={{ fontSize: "19px" }}
                  >
                    Aug 16, 2023
                  </span>
                </span>
                <div className={Styles.estimatedDeldiv}>
                  <span
                    className={Styles.estimatedSpan}
                    style={{ fontSize: "19px", fontWeight: "600" }}
                  >
                    Refund initiated for 1 item
                  </span>
                </div>
              </div>

              <span style={{ fontSize: "19px" }}>Order ID : 3354654654526</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingRight: "30px",
              }}
            >
              <span style={{ fontSize: "13px", fontFamily: "Ledger" }}>
                ₹ {order.amount / 100} will be refunded to your original payment
                method
              </span>
              <button
                className={Styles.TrackOrder}
                onClick={() => setrefundOrder(false)}
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
          <div className={Styles.middleDiv}>
            <div
              className={Styles.OrderDetaildiv}
              style={{
                borderBottom: "1px solid rgba(128, 128, 128, 0.508)",
                paddingBottom: "30px",
              }}
            >
              <div className={Styles.BasicDetails}>
                <img src={order.image} alt="" />
                <div className={Styles.basicWriteen}>
                  <span className={Styles.Ordername}>
                    Lehenga Faux Georgette
                  </span>
                  <span className={Styles.basicCat}>{order.size}</span>
                </div>
              </div>
              <div className={Styles.ammountAndqty}>
                <span className={Styles.Amount}>₹{order.amount / 100}</span>
                <span className={Styles.qty}>Qty : 1</span>
              </div>
            </div>
            <div
              style={{
                marginBottom: "0px",
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
                {steps1?.map((label) => (
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
          </div>
          <div className={Styles.refSumManagRef}>
            <div className={Styles.refSum}>
              <span className={Styles.refsumspan}>Refund Summary</span>
              <span style={{ fontSize: "14px", marginBottom: "20px" }}>
                The amount will be refunded to the original payment method
              </span>
              <article>
                <span>Refund Sub Total</span>
                <span>₹{order.amount / 100}</span>
              </article>
              {/* <article>
                <span>Shipping & handling</span>
                <span>₹0.00</span>
              </article>
              <article>
                <span>Estimated tax </span>
                <span>₹0.00</span>
              </article> */}
              <article className={Styles.TotalexRef}>
                <span>Total expected refund</span>
                <span>₹{order.amount / 100}</span>
              </article>
            </div>
            <div className={Styles.Manageref}>
              <span style={{ fontSize: "22px", marginBottom: "30px" }}>
                Manage Your Refund
              </span>
              <div className={Styles.managerefinnerdiv}>
                <span>View order details</span>
                <span>Write a product review</span>
                <span>Refund timeline</span>
              </div>
              <button
                className={Styles.Contbtn}
                onClick={() => setrefundOrder(false)}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={Styles.orderbtndates}>
            <div className={Styles.orderIdAndButton1}>
              <div className={Styles.orderStatusAndId}>
                <span style={{ color: "#B72E5A" }}>Refund Initiated</span>
                <span>Order ID : {order._id}</span>
              </div>
              <div className={Styles.OrderDate1}>
                <span>Order Date</span>
                <span>{moment(order?.createdAt).format("MMM DD YYYY")}</span>
              </div>
            </div>
            <div className={Styles.Dates}>
              <div className={Styles.estimatedDeldiv}>
                <span className={Styles.estimatedSpan}>
                  Refund Initiated for {order.quantity} item
                </span>
              </div>
            </div>
            <div className={Styles.btndivorderTrack}>
              <button
                className={Styles.TrackOrder}
                onClick={() => {
                  setTrackPackage(false);
                  setrefundOrder(false);
                }}
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
                {steps1?.map((label) => (
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
                  <span className={Styles.basicCat}>Qty : 1</span>
                </div>
              </div>
              {/* <div className={Styles.ammountAndqty}>
                    <span className={Styles.Amount}>₹{order.amount/100}</span>
                    <span className={Styles.qty}>Qty : 1</span>
                  </div> */}
            </div>
          </div>
          <div className={Styles.FinalDiv}>
            <div className={Styles.refSum} style={{ width: "100%" }}>
              <span className={Styles.refsumspan} style={{ fontSize: "19px" }}>
                Refund Summary
              </span>
              <span style={{ fontSize: "12px", marginBottom: "20px" }}>
                The amount will be refunded to the original payment method
              </span>
              <article style={{ fontSize: "16px" }}>
                <span>Refund Sub Total</span>
                <span>₹{order.amount / 100}</span>
              </article>
              {/* <article style={{ fontSize: "16px" }}>
                <span>Shipping & handling</span>
                <span>₹0.00</span>
              </article>
              <article style={{ fontSize: "16px" }}>
                <span>Estimated tax </span>
                <span>₹0.00</span>
              </article> */}
              <article
                className={Styles.TotalexRef}
                style={{ fontSize: "15px" }}
              >
                <span style={{ fontSize: "16px" }}>Total expected refund</span>
                <span style={{ fontSize: "16px" }}>₹{order.amount / 100}</span>
              </article>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RefundOrder;
