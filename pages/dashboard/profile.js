import { PlusOutlined } from '@ant-design/icons';
import Header from '../../Components/Dashboard/Header';
import Sidebar from '../../Components/Dashboard/Sidebar';
import { Modal as AntdModal, Upload } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Styles from '../../styles/Dashboard/Dashboard.module.css';
import { useEffect, useState } from 'react';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// import Input from "../../Components/Input";
import {
  Box,
  Button,
  FormLabel,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import AlertDialog from '../../Components/common/AlertDialogue';
import { useRouter } from 'next/router';
import Colors from '../../constants/colors';
import axios from 'axios';
import { PROXY } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, user } from '../../redux/reducer/appEssentials';
import Layout from '../../Components/Dashboard/layout';
import VendorProfile from '../../Components/Dashboard/VendorProfile';
import VenueProfile from '../../Components/Dashboard/VenueProfile';
import compressAndAppendFiles from '../../Components/compressAndAppendFiles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ProfileScreenTemplate = () => {
  const globleuser = useSelector(selectUser);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   !globleuser.success && router.push("/");
  // }, []);
  //for sidebars
  const router = useRouter();

  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!globleuser) {
      router.push('/');
    }

    setRole(globleuser.data);
  }, [router]);

  //body
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [Alert, SetAlert] = useState({
    visible: false,
    title: '',
    message: '',
  });
  const [profilePic, setProfilePic] = useState([]);
  const [profilePicLink, setProfilePicLink] = useState('');
  const [coverPic, setCoverPic] = useState([]);
  const [coverPicLink, setCoverPicLink] = useState([]);
  const [email, setEmail] = useState('');
  const [Phone, setPhone] = useState('');
  const [currentPass, setCurrentPass] = useState('');
  const [Password, setPassword] = useState('');
  const [Password2, setPassword2] = useState('');
  const [User, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [verifyFor, setVerifyFor] = useState('mobile');
  const [otp, setOtp] = useState('');
  ``;
  const [confirmOTP, setConfirmOTP] = useState('');

  const [commonAlert, setCommonAlert] = useState({ open: false, msg: '' });

  const [studentData, setStudenData] = useState({
    name: '',
    company_name: '',
    email: '',
    mobile: '',
    profile_pic: '',
    company_address: '',
    cover_pic: [],
    shipping_address: '',
    city: '',
    is_email_verified: false,
    is_mobile_verified: false,
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const setDefaultImages = (url, uid) => {
    return {
      uid,
      status: 'done',
      url,
    };
  };
  const setDefaultImages1 = (data) => data?.map((data) => data?.url);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const [isMobileOtpSent, setIsMobileOtpSent] = useState({
    status: false,
    timeOut: null,
  });
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  useEffect(() => {
    if (globleuser?.role === 'ShopNow') {
      setStudenData({
        ...studentData,
        name: role?.name,
        company_name: role?.company_name,
        mobile: role?.mobile,
        email: role?.email,
        company_address: role?.company_address,
        address1: role?.warehouse_address[0].address1,
        address2: role?.warehouse_address[0].address2,
        landmark: role?.warehouse_address[0].landmark,
        state: role?.warehouse_address[0].state,
        city: role?.warehouse_address[0].city,
        pincode: role?.warehouse_address[0].pincode,
        country: role?.warehouse_address[0].country,
        is_email_verified: role?.is_email_verified,
        is_mobile_verified: role?.is_mobile_verified,
      });
    } else {
      setStudenData({
        ...studentData,
        name: role?.name,
        company_name: role?.company_name,
        mobile: role?.mobile,
        email: role?.email,
        address1: globleuser?.data?.address1,
        address2: globleuser?.data?.address2,
        landmark: globleuser?.data?.landmark,
        state: globleuser?.data?.data?.state,
        city: globleuser?.data?.city,
        pincode: globleuser?.data?.pincode,
        country: globleuser?.data?.country,
        is_email_verified: role?.is_email_verified,
        is_mobile_verified: role?.is_mobile_verified,
      });
    }

    if (role?.profile_pic) {
      const data = setDefaultImages(role?.profile_pic, 1);

      setProfilePic([data]);
      setProfilePicLink(data.url);
    }

    if (role?.cover_pic?.length) {
      const data = role?.cover_pic?.map((url, uid) => {
        return setDefaultImages(url, uid);
      });
      setCoverPic(data);
      setCoverPicLink(setDefaultImages1(data));
    }
  }, [role]);

  //Header

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: '' });
  };

  const updatePassword = async () => {
    if (!currentPass) {
      alert('please enter current Password');
      return;
    }
    if (!Password) {
      alert('please enter new Password');
      return;
    }
    if (!Password2) {
      alert('please re-enter new Password');
      return;
    }
    if (Password !== Password2) {
      alert('new passwords are not same');
      return;
    }
    if (Password === currentPass) {
      alert('new passwords should be different from old Password');
      return;
    }
    try {
      if (globleuser?.role === 'ShopNow') {
        const data = await axios.put(
          `${PROXY}/shopnowuser/updatewithpass`,
          {
            currentPassword: currentPass,
            password: Password,
          },
          {
            headers: {
              authorization: role.token,
            },
          }
        );
        if (data.data.success) {
          alert('password changed successfully');
          setCurrentPass('');
          setPassword('');
          setPassword2('');
        }
      } else {
        const data = await axios.patch(
          `${PROXY}/users/updatewithpass`,
          {
            currentPassword: currentPass,
            password: Password,
            _id: role._id,
          },
          {
            headers: {
              authorization: role.token,
            },
          }
        );
        if (data.data.success) {
          alert('password changed successfully');
        }
      }
    } catch (error) {
      if (error?.response?.data?.error?.message) {
        alert(error?.response?.data?.error?.message);
        return;
      } else {
        alert('Something went wrong');
      }
    }
  };

  const updateProfile = async () => {
    try {
      const form = new FormData();
      let data;
      if (globleuser?.role === 'ShopNow') {
        data = {
          name: studentData.name,
          company_name: studentData.company_name,
          email: studentData.email,
          mobile: `${studentData.mobile}`,
          company_address: studentData.company_address,
          warehouse_address: [
            {
              address1: studentData.address1,
              address2: studentData.address2,
              landmark: studentData.landmark,
              state: studentData.state,
              city: studentData.city,
              pincode: studentData.pincode,
              country: studentData.country,
            },
          ],
        };
      } else {
        data = {
          name: studentData.name,
          company_name: studentData.company_name,
          email: studentData.email,
          mobile: `${studentData.mobile}`,
          address1: studentData.address1,
          address2: studentData.address2,
          landmark: studentData.landmark,
          state: studentData.state,
          city: studentData.city,
          pincode: studentData.pincode,
          country: studentData.country,
          _id: studentData._id,
          token: studentData.token,
        };
      }

      form.append('data', JSON.stringify(data));
      // profilePic &&
      //   profilePic.forEach((item, key) => {
      //     form.append("profile", item.originFileObj);
      //   });
      // coverPic &&
      //   coverPic.forEach((item, key) => {
      //     form.append("cover", item.originFileObj);
      //   });
      await compressAndAppendFiles(coverPic, form, 'cover');
      await compressAndAppendFiles(profilePic, form, 'profile');

      form.append('profilelink', profilePicLink);
      form.append('coverlink', JSON.stringify(coverPicLink));
      if (globleuser?.role === 'ShopNow') {
        const res = await axios.put(`${PROXY}/shopnowuser/update`, form, {
          headers: {
            authorization: globleuser?.data?.token,
          },
        });
        if (res) {
          (res.data.data.token = role?.token),
            localStorage.setItem(
              'wedcell',
              JSON.stringify({
                ...res.data,
              })
            );
          setLoading(false);
          alert('updated Succesfully');
          res.data.data.token = globleuser?.data?.token;
          dispatch(user(res.data));
          localStorage.setItem('wedcell', JSON.stringify(res.data));
          router.push('/dashboard/sellersdashboard');
          // location.reload(true);
        }
      } else {
        const res = await axios.patch(`${PROXY}/users/update`, form, {
          headers: {
            authorization: globleuser?.data?.token,
          },
        });
        if (res) {
          (res.data.data.token = role?.token),
            localStorage.setItem(
              'wedcell',
              JSON.stringify({
                ...res.data,
              })
            );
          setLoading(false);
          alert('updated Succesfully');
          res.data.data.token = globleuser?.data?.token;
          dispatch(user(res.data));
          localStorage.setItem('wedcell', JSON.stringify(res.data));
          router.push('/dashboard');
          // location.reload(true);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('rr', error);
      alert(error?.response?.data?.error?.message);
    }
  };

  function ValidateEmail(mail) {
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        myForm.emailAddr.value
      )
    ) {
      return true;
    }
    alert('You have entered an invalid email address!');
    return false;
  }

  const SendMobileOTP = async (type) => {
    if (type === 'sent') {
      if (!isMobileOtpSent.status) {
        const persisOtpData = {};
        try {
          const data = await axios.post(`${PROXY}/otp`, {
            mobile: studentData.mobile,
          });
          if (data) {
            persisOtpData.status = true;
            const timeout = setTimeout(() => {
              setIsMobileOtpSent({
                ...isMobileOtpSent,
                status: false,
              });
            }, 300000);
            persisOtpData.timeOut = timeout;
            setIsMobileOtpSent(persisOtpData);
            alert('otp Sent Successfuly');
          }
        } catch (error) {
          console.error(
            `🚀 ~ file: profile.jsx:352 ~ SendMobileOTP ~ error:`,
            error
          );
          alert('error occured while sending otp');
        }
      }
    } else {
      try {
        const data = axios.post(`${PROXY}/otp`, {
          mobile: studentData.mobile,
        });
        if (data) {
          clearTimeout(isMobileOtpSent.timeOut);
          const timeout = setTimeout(() => {
            setIsMobileOtpSent({
              ...isMobileOtpSent,
              status: false,
            });
          }, 300000);
          setIsMobileOtpSent({
            ...isMobileOtpSent,
            timeOut: timeout,
          });
          alert('otp re-Sent Successfuly');
        }
      } catch (error) {
        console.error(
          `🚀 ~ file: profile.jsx:352 ~ SendMobileOTP ~ error:`,
          error
        );
        alert('error occured while sending otp');
      }
    }
    setModalVisible(true);
  };

  const VerifyOTP = async (type) => {
    if (!otp.length) {
      alert('please neter otp');
      return;
    }
    if (type === 'mobile') {
      const response = await axios.post(`${PROXY}/otp/verify`, {
        mobile: studentData.mobile,
        otp,
      });

      if (response.data.success) {
        const responce = await axios.post(
          `${PROXY}/student/verify`,
          { mobile: studentData.mobile },
          {
            headers: {
              authorization: role?.token,
            },
          }
        );
        role.student.is_mobile_verified = true;
        role.student.is_approved = true;
        role.student.mobile = studentData.mobile;
        setRole(role);
        localStorage.setItem(
          'wedcell',
          JSON.stringify({
            student: role.student,
            token: role.token,
          })
        );
        alert('mobile verify succesfully');
        location.reload(true);
      }
    }

    setModalVisible(false);
  };

  const SendEmailOTP = async () => {
    if (ValidateEmail(email)) {
      axios
        .post(`${PROXY}/email2/addEmail`, {
          mobile: Phone,
        })
        .then((res) => {
          if (res.data.error) {
            alert('');
          }

          if (res.data.message) {
            alert('OTP sent to your email address');
          }
          setConfirmOTP(res.data.otp);
          setVerifyFor('email');
          setModalVisible(true);
          alert('OTP sent');
        })
        .catch((e) => {
          setLoading(false);
          console.error('Someting Went Wrong', e);
          alert('OTP not sent:', e.message);
        });
    }
  };

  const errorr = () =>
    toast.error('image cant be uploaded with size bigger then 500kb', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  const uploadErrorr = () =>
    toast.error('Somethimg went wrong please try again', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  const uploadSucsess = () =>
    toast.success('Uploading done Successfully', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  const editSucsess = () =>
    toast.success('Edit done Successfully', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const VerifyEmailOTP = async () => {};

  const handleChangeCover = ({ fileList: newFileList, file }) => {
    if (file.status !== 'removed') {
      setCoverPic(newFileList);
    } else {
      const data = newFileList
        .filter((data) => data.url)
        .map((data) => data.url);
      setCoverPicLink(data);
      setCoverPic(newFileList);
    }
  };

  const handleChangeProfile = ({ fileList: newFileList, file }) => {
    if (file.status !== 'removed') {
      if (file.size / 1028 <= 500) {
        setProfilePic(newFileList);
      } else {
        errorr();
      }
    } else {
      setProfilePic(newFileList);
      setProfilePicLink('');
    }
  };

  return (
    <Layout>
      {globleuser?.role === 'Vendor' ? (
        <VendorProfile></VendorProfile>
      ) : globleuser?.role === 'Venue' ? (
        <VenueProfile></VenueProfile>
      ) : (
        <>
          <Modal
            open={modalVisible}
            onClose={() => setModalVisible(false)}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Box sx={styles.centeredBox}>
                <Box sx={styles.modalBox}>
                  <Typography sx={styles.modalText}>
                    Type OTP received
                  </Typography>
                  <TextField
                    floatingPlaceholder
                    floatOnFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder='OTP'
                    type='number'
                    style={{
                      marginBottom: '10px',
                    }}
                  />
                  <Box onClick={() => SendMobileOTP('re-sent')}>
                    <Typography
                      sx={{ color: Colors.primary, fontWeight: 'bold' }}
                    >
                      Resend OTP
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: '15px',
                    }}
                  >
                    <Button
                      variant='text'
                      onClick={() => VerifyOTP('mobile')}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant='text'
                      onClick={() => setModalVisible(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Modal>
          <div style={{ width: '95%' }}>
            <div className='form-container'>
              <h4 className='mb-4'>Company Info</h4>

              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                required
                id='name'
                textNumSpace
                minLength={1}
                label='Name'
                value={studentData?.name}
                onChange={(text) => {
                  setStudenData({
                    ...studentData,
                    name: text.target.value,
                  });
                }}
              />
              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                required
                id='company_name'
                textNumSpace
                minLength={1}
                label='Company Name'
                value={studentData?.company_name}
                onChange={(text) => {
                  setStudenData({
                    ...studentData,
                    company_name: text.target.value,
                  });
                }}
              />
              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                required
                id='email'
                textNumSpace
                minLength={1}
                label='Email'
                value={studentData?.email}
                onChange={(text) => {
                  setStudenData({
                    ...studentData,
                    email: text.target.value,
                  });
                }}
              />
              {role?.is_email_verified ? (
                <Typography sx={{ color: 'green', marginBottom: 1 }}>
                  Verified
                </Typography>
              ) : (
                <Box onClick={() => {}}>
                  <Typography
                    sx={{
                      color: Colors.primary,
                      fontWeight: 'bold',
                      marginBottom: 1,
                    }}
                  >
                    Send OTP
                  </Typography>
                </Box>
              )}
              <TextField
                type='number'
                variant='outlined'
                margin='normal'
                fullWidth
                required
                id='phone'
                textNumSpace
                minLength={1}
                label='Phone'
                value={studentData?.mobile}
                onChange={(text) => {
                  setStudenData({
                    ...studentData,
                    mobile: text.target.value,
                  });
                  if (isMobileOtpSent) {
                    clearTimeout(isMobileOtpSent.timeOut);
                    setIsMobileOtpSent({
                      status: false,
                      timeOut: null,
                    });
                  }
                }}
              />
              {role?.is_mobile_verified ? (
                <Typography sx={{ color: 'green', marginBottom: 1 }}>
                  Verified
                </Typography>
              ) : (
                <Box onClick={() => SendMobileOTP('sent')}>
                  <Typography
                    sx={{
                      color: Colors.primary,
                      fontWeight: 'bold',
                      marginBottom: 1,
                    }}
                  >
                    Send OTP
                  </Typography>
                </Box>
              )}
              <Grid
                container
                direction={'row'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Grid
                  item
                  xs={3}
                >
                  <FormLabel id='currentlyEmployed'>Profile Images</FormLabel>
                  <br />
                  <br />
                  <Upload
                    listType='picture-card'
                    fileList={profilePic}
                    onPreview={handlePreview}
                    onChange={handleChangeProfile}
                  >
                    {profilePic.length >= 1 ? null : uploadButton}
                  </Upload>
                </Grid>
                <Grid
                  item
                  xs={9}
                >
                  <FormLabel id='currentlyEmployed'>Cover Images</FormLabel>
                  <br />
                  <br />
                  <Upload
                    listType='picture-card'
                    fileList={coverPic}
                    onPreview={handlePreview}
                    onChange={handleChangeCover}
                  >
                    {coverPic?.length >= 5 ? null : uploadButton}
                  </Upload>
                </Grid>
              </Grid>
              <br />
              <FormLabel
                id='currentlyEmployed'
                style={{ fontSize: '17px', marginBottom: '12PX' }}
              >
                Company Address
              </FormLabel>
              <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                <TextField
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  required
                  multiline
                  rows={3}
                  id='Company Address...'
                  textNumSpace
                  InputLabelProps={{ shrink: true }}
                  minLength={1}
                  label='Company Address...'
                  value={studentData?.company_address}
                  onChange={(text) => {
                    setStudenData({
                      ...studentData,
                      company_address: text.target.value,
                    });
                  }}
                />
              </div>
              <FormLabel
                id='currentlyEmployed'
                style={{
                  fontSize: '17px',
                  marginBottom: '12PX',
                  marginTop: '15px',
                }}
              >
                Warehouse Address
              </FormLabel>
              <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                <TextField
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  required
                  id='address'
                  textNumSpace
                  InputLabelProps={{ shrink: true }}
                  minLength={1}
                  label='Adderess 1'
                  value={studentData?.address1}
                  onChange={(text) => {
                    setStudenData({
                      ...studentData,
                      address1: text.target.value,
                    });
                  }}
                />
              </div>
              <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                <TextField
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  required
                  id='address'
                  textNumSpace
                  minLength={1}
                  InputLabelProps={{ shrink: true }}
                  label='Adderess 2'
                  value={studentData?.address2}
                  onChange={(text) => {
                    setStudenData({
                      ...studentData,
                      address2: text.target.value,
                    });
                  }}
                />
              </div>
              <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                <TextField
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  required
                  id='address'
                  textNumSpace
                  minLength={1}
                  InputLabelProps={{ shrink: true }}
                  label='Landmark'
                  value={studentData?.landmark}
                  onChange={(text) => {
                    setStudenData({
                      ...studentData,
                      landmark: text.target.value,
                    });
                  }}
                />
              </div>
              <div className='row'>
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6'>
                  <TextField
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    required
                    id='address'
                    textNumSpace
                    minLength={1}
                    InputLabelProps={{ shrink: true }}
                    label='State'
                    value={studentData?.state}
                    onChange={(text) => {
                      setStudenData({
                        ...studentData,
                        state: text.target.value,
                      });
                    }}
                  />
                </div>
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6'>
                  <TextField
                    value={studentData?.country}
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    required
                    id='address'
                    textNumSpace
                    minLength={1}
                    label='Country'
                    InputLabelProps={{ shrink: true }}
                    onChange={(text) => {
                      setStudenData({
                        ...studentData,
                        country: text.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6'>
                  <TextField
                    value={studentData?.city}
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    required
                    id='address'
                    textNumSpace
                    minLength={1}
                    InputLabelProps={{ shrink: true }}
                    label='City'
                    onChange={(text) => {
                      setStudenData({
                        ...studentData,
                        city: text.target.value,
                      });
                    }}
                  />
                </div>
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6'>
                  <TextField
                    variant='outlined'
                    margin='normal'
                    fullWidth
                    required
                    id='address'
                    textNumSpace
                    minLength={1}
                    label='Pincode'
                    InputLabelProps={{ shrink: true }}
                    value={studentData?.pincode}
                    onChange={(text) => {
                      setStudenData({
                        ...studentData,
                        pincode: text.target.value,
                      });
                    }}
                  />
                </div>
              </div>

              <Button
                fullWidth
                onClick={updateProfile}
              >
                Update Profile
              </Button>
              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                required
                id='currentPassword'
                textNumSpace
                minLength={1}
                label='Current Password'
                value={currentPass}
                onChange={(text) => {
                  setCurrentPass(text.target.value);
                }}
              />
              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                required
                id='newPassword'
                textNumSpace
                minLength={1}
                label='New Password'
                value={Password}
                onChange={(text) => {
                  setPassword(text.target.value);
                }}
              />
              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                required
                id='newPasswordTwo'
                textNumSpace
                minLength={1}
                label='Re-Type New Password'
                value={Password2}
                onChange={(text) => {
                  setPassword2(text.target.value);
                }}
              />
              <Button
                fullWidth
                onClick={updatePassword}
              >
                Update Password
              </Button>
              {/* <Input
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="productTitle"
              textNumSpace
              minLength={1}
              label="Product Title"
              name="productTitle"
              autoComplete="productTitle"
              errorText="Please enter a valid title!"
              //   keyboardType="default"
              //   autoCapitalize="sentences"
              //   autoCorrect
              returnKeyType="next"
              onInputChange={(text) => {
              }}
              initialValue={"Value"}
              initiallyValid={true}
            /> */}
              {/* <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Enter Old Password"
                    className="form-control py-2"
                  />
                </div>
              </div>
              <div className="col-md-8">
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Enter New Password"
                    className="form-control py-2"
                  />
                </div>
              </div>
            </div> */}
              {/* <button className="primary-sm-btn">Submit</button> */}
            </div>
          </div>
          <AlertDialog
            open={commonAlert.open}
            onClose={handleCommonAlertClose}
          >
            {commonAlert.msg}
          </AlertDialog>

          <AntdModal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt='example'
              style={{
                width: '100%',
              }}
              src={previewImage}
            />
          </AntdModal>
          <ToastContainer
            position='top-right'
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />
        </>
      )}
    </Layout>
  );
};

export default ProfileScreenTemplate;

const styles = {
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: '20px',
    fontSize: '24px',
    textAlign: 'start',
  },
};
