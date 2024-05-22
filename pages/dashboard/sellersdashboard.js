import Header from '../../Components/Dashboard/Header';
import Styles from '../../styles/Dashboard/Dashboard.module.css';
import { useEffect, useState } from 'react';
import Sidebar from '../../Components/Dashboard/Sidebar';
import ShopNowBox from '../../Components/Dashboard/ShopNowBox';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/reducer/appEssentials';
import Layout from '../../Components/Dashboard/layout';
import DefDashBoard from '../../Components/Dashboard/DefDashBoard';
import AddShopItems from '../../Components/Dashboard/shop/AddShopItems';
import ProductModal from '../../Components/Auth/ProductModal';

const Dashboard = () => {
  const [productId, setproductId] = useState(true);
  const [currState, setCurrState] = useState('Listing');
  const globleuser = useSelector(selectUser);
  const router = useRouter();

  const [data, setData] = useState();

  useEffect(() => {
    const auth = localStorage.getItem('wedcell');
    const role = localStorage.getItem('role');
    setData(JSON.parse(auth));

    if (!auth || JSON.parse(role).role !== 'ShopNow') {
      router.push('/');
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
  return (
    <Layout>
      <ProductModal openModal={open}></ProductModal>
      {currState === 'Listing' ? (
        <ShopNowBox
          setCurrState={setCurrState}
          setproductId={setproductId}
        />
      ) : currState === 'AddShopItem' ? (
        <AddShopItems
          setCurrState={setCurrState}
          productId={productId}
        ></AddShopItems>
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default Dashboard;
