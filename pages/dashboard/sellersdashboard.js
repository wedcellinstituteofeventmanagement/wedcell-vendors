import { useEffect, useState } from "react";
import ShopNowBox from "../../Components/Dashboard/ShopNowBox";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/reducer/appEssentials";
import Layout from "../../Components/Dashboard/layout";
import AddShopItems from "../../Components/Dashboard/shop/AddShopItems";
import AddOtherProduct from "../../Components/Dashboard/shop/AddOtherProduct";
import ShopNowModal from "../../Components/Auth/ShopNowModal";
import OtherProductBox from "../../Components/Dashboard/OtherProductBox";

const Dashboard = () => {
  const [productId, setproductId] = useState(true);
  const [currState, setCurrState] = useState("Listing");
  const globleuser = useSelector(selectUser);
  const router = useRouter();

  const [data, setData] = useState();

  useEffect(() => {
    const auth = localStorage.getItem("wedcell");
    const role = localStorage.getItem("role");
    setData(JSON.parse(auth));

    if (!auth || JSON.parse(role).role !== "ShopNow") {
      router.push("/");
    }
  }, []);
  let [open, setOpen] = useState(false);
  useEffect(() => {
    if (!globleuser?.data?.email) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [globleuser]);
  if (globleuser?.data?.categories === "Clothes") {
    return (
      <Layout>
        <ShopNowModal openModal={open}></ShopNowModal>
        {currState === "Listing" ? (
          <ShopNowBox setCurrState={setCurrState} setproductId={setproductId} />
        ) : currState === "AddShopItem" ? (
          <AddShopItems
            setCurrState={setCurrState}
            productId={productId}
          ></AddShopItems>
        ) : (
          <></>
        )}
      </Layout>
    );
  } else {
    return (
      <Layout>
        <ShopNowModal openModal={open}></ShopNowModal>
        {currState === "Listing" ? (
          <OtherProductBox
            setCurrState={setCurrState}
            setproductId={setproductId}
          />
        ) : currState === "AddShopItem" ? (
          <AddOtherProduct
            setCurrState={setCurrState}
            productId={productId}
          ></AddOtherProduct>
        ) : (
          <></>
        )}
      </Layout>
    );
  }
};

export default Dashboard;
