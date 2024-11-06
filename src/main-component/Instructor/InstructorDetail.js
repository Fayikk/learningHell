import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Scrollbar from "../../components/scrollbar/scrollbar";
import Footer from "../../components/footer/Footer";
import PageTitle from "../../components/pagetitle/PageTitle";
import { useTranslation } from "react-i18next";
import CourseSectionS3 from "../../components/CourseSectionS3/CourseSectionS3";
import InstructorAuth from "../../Wrappers/HoC/InstructorAuth";
import { useGetAllInstructorCoursesMutation } from "../../api/instructorApi";
import { Languages } from "../Extensions/Languages";
import BankInfoModal from "../CustomComponents/BankInfoModal";
import {
  useCreateCourseAsyncMutation,
  useGetCourseByIdMutation,
  useRemoveCourseAsyncMutation,
  useUpdateCourseMutation,
} from "../../api/courseApi";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useChechBankInformationMutation } from "../../api/accountApi";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Input } from "reactstrap";
import { instructorApi } from "../../api/instructorApi";
import { useDispatch,useSelector } from "react-redux";
import { toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useLazyGetAllCategoriesForSelectedQuery } from "../../api/categoryApi";
import Spinner from "react-bootstrap/Spinner";
import { useAddBankInfoMutation, useInstructorSubDetailMutation, useInstructorUpdateMutation } from "../../api/InstructorSubApi";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};



const buttonStyle = {
  backgroundColor: "#3f51b5", 
  color: "#fff",
  padding: "10px 20px", 
  borderRadius: "8px", 
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
  textTransform: "none", 
  fontSize: "16px", 
  margin: "10px", 
  transition: "background-color 0.3s ease", 
};

function InstructorDetail() {
  const dispatch = useDispatch();
  const [pageCounter, setPageCounter] = useState(0);
  const [courses, setCourses] = useState([]);
  const [instructorUpdate] = useInstructorUpdateMutation();
  const [categories, setCategories] = useState([]);
  const userId = useSelector((state) => state.authStore.nameIdentifier);
  const userEmail = useSelector((state) => state.authStore.email);
  const user = useSelector((state) => state.authStore);
  const [bankStateInfo,setBankStateInfo] = useState('')
  const [getAllStudentCourses] = useGetAllInstructorCoursesMutation();
  const [
    getAllCategories,
    { data: categoriesData, isLoading: isCategoriesLoading },
  ] = useLazyGetAllCategoriesForSelectedQuery();
  const [createCourseAsync] = useCreateCourseAsyncMutation();
  const [removeCourseAsync] = useRemoveCourseAsyncMutation();
  const [checkBankInformation] = useChechBankInformationMutation();
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [courseModel, setCourseModel] = useState({
    courseName: "",
    coursePrice: 0,
    courseLanguage: "",
    courseDescription: "",
    imageUrl: "",
    categoryId: "",
    introductionVideo: "",
    courseImage: "",
    isFree:false,
  });
  const [instructorDetails] = useInstructorSubDetailMutation();
  const [introductionVideo, setIntroductionVideo] = useState(null);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [openCourseModal, setOpenCourseModal] = useState(false);
  const [isActiveButton, setIsActiveButton] = useState(true);
  const [isUpdateProcess, setIsUpdateProcess] = useState(false);
  const handleOpen = () => setOpen(true);
  const [openBankInfoModal, setOpenBankInfoModal] = useState(false);
  const [disableDom,setDisableDom] = useState(false);
  const [addBankInfo] = useAddBankInfoMutation();
  const [bankInfo, setBankInfo] = useState({
    InstructorName: '',
    InstructorSurname: '',
    IdentityNumber: '',
    Address: '',
    Iban: '',
    BankName: '',
    PaymentAccountId: '',
    InstructorBankDetailId:''
  });
  const handleClose = () => {
    setCourseModel({
      courseName: "",
      coursePrice: 0,
      courseLanguage: "",
      courseDescription: "",
      imageUrl: "",
      categoryId: "",
      introductionVideo: "",
      courseImage: "",
    }),
      setIsUpdateProcess(false),
      setOpen(false);
  };
  const redButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ff1744",
  };
  const greenButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#00FF00",
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = "#303f9f";
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = "#3f51b5";
  };
  const handleOpenCourseModal = () => setOpenCourseModal(true);
  const handleCloseCourseModal = () => setOpenCourseModal(false);
  const [getCourse] = useGetCourseByIdMutation();
  const [handleUpdateCourse] = useUpdateCourseMutation();
  const [courseId, setCourseId] = useState();
  const [filter, setFilter] = useState({
    isSearch: true,
    pageIndex: 1,
    pageSize: 6,
    sortColumn: "CourseName",
    sortOrder: "desc",
    filters: {
      groupOp: "AND",
      rules: [
        {
          field: "UserId",
          op: 1,
          data: "",
        },
      ],
    },
  });
  useEffect(() => {
    async function fetchData() {
      // You can await here
      await getAllStudentCourses(filter).then((response) => {
        setCourses(response.data.result != [] ? response.data.result.data : []);
        // setCurrentPage(response.data.result.data)
        setPageCounter(response.data.result.paginationCounter);
      });
      // ...
    }
    fetchData();
  }, [filter, open]);


  const openManuelBankInfoModal = async  () => {


    await instructorDetails(user.InstructorSubId).then((response) => {
      if (response.data.isSuccess) {
        setBankInfo((prevState) =>({
          ...prevState,
          InstructorName:response.data.result.instructorName,
          InstructorSurname:response.data.result.instructorSurname,
          IdentityNumber:response.data.result.identityNumber,
          Address:response.data.result.address,
          Iban:response.data.result.instructorBankDetail.iban,
          BankName:response.data.result.instructorBankDetail.bankName,
        }))
        setBankStateInfo("update")
        setOpenBankInfoModal(true)
        
      }
    })



  }


  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.result);
    }
  }, [categoriesData]);

  useEffect(() => {
    // alert("Please be carefull! while You are added  introduction video for create new course,video duration must is not duration 10 seconds than high")
    if (userId) {
      checkBankInformation(userId).then((response) => {
        if(!response.data.isSuccess){
          toast.warning(response.data.message)
          setDisableDom(true);
          setOpenBankInfoModal(true);
        }
      })
    }
   
    
    getAllCategories();
  }, [userId]);



  const checkUserBankDetail = () => {
    if (userId) {
      checkBankInformation(userId).then((response) => {
        if(!response.data.isSuccess){
          toast.warning(response.data.message)
          setDisableDom(true);

          setOpenBankInfoModal(true);
          setOpen(false)
          return;
        }
      })
    }
  }

  console.log("trigger course model",courseModel.isFree)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleModalClose = () => {
    setOpenBankInfoModal(false);
  };
  // if (isCoursesLoading || isCategoriesLoading) {
  //   return <IsLoading />;
  // }
  const handleClickChangePageNumber = (clickedPageNumber) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      pageIndex: clickedPageNumber,
    }));
  };

  const createCourse = async () => {
    if (image == null) {
      alert("Please Check Your Course Image");
      return;
    }
    var result = image.type.split("/");

    if (result[0] != "image") {
      alert("You must choosen only image");
      return;
    }

    // if (imageDimensions.width > 2270 && imageDimensions.height > 860) {
    //   alert(
    //     "Please check your image dimension.Image dimension so high. Max dimension is 1170x867"
    //   );
    //   return;
    // }

    setIsActiveButton(false);
    const formData = new FormData();
    formData.append("CourseName", courseModel.courseName);
    formData.append("CoursePrice", courseModel.coursePrice);
    formData.append("CourseLanguage", courseModel.courseLanguage);
    formData.append("CourseDescription", courseModel.courseDescription);
    formData.append("IntroductionVideo", introductionVideo);
    formData.append("Image", image);
    formData.append("ImageUrl", courseModel.imageUrl);
    formData.append("CategoryId", courseModel.categoryId);
    formData.append("IsFree",courseModel.isFree)

    await createCourseAsync(formData).then((response) => {
      if (response.data.isSuccess) {
        setIsActiveButton(true);

        handleClose();
        dispatch(instructorApi.util.invalidateTags(["instructor"]));
        toast.success(response.data.messages[0]);
      } else {
        setIsActiveButton(true);

        toast.error(response.data.errorMessages[0]);
      }
    });
  };

  const handleRemoveCourse = async (courseId) => {
    const answer = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (answer) {
      await removeCourseAsync(courseId).then((response) => {

        if (response.data.isSuccess) {
          dispatch(instructorApi.util.invalidateTags(["instructor"]));
          dispatch(instructorApi.util.invalidateTags(["instructor"]));
          toast.success("Course removed successfully");
          setOpenCourseModal(false);
        }
      });
    }
  };

  const handleGetCourse = async (courseId) => {
    // response.data.result.item1
    setCourseId(courseId);
    await getCourse(courseId).then((response) => {
      if (response.data.isSuccess) {
        setIsUpdateProcess(true);
        setCourseModel({
          courseName: response.data.result.item1.courseName,
          coursePrice: response.data.result.item1.coursePrice,
          courseLanguage: response.data.result.item1.courseLanguage,
          courseDescription: response.data.result.item1.courseDescription,
          introductionVideo: response.data.result.item1.introductionVideoUrl,
          courseImage: response.data.result.item1.courseImage,
          categoryId: response.data.result.item1.categoryId,
        });

        handleOpen();
      } else {
      }
    });
  };

  const updateCourse = async () => {
    // formData.append("IntroductionVideo", introductionVideo);
    // formData.append("Image", image);

    const formData = new FormData();
    formData.append("CourseName", courseModel.courseName);
    formData.append("CoursePrice", courseModel.coursePrice);
    formData.append("CourseLanguage", courseModel.courseLanguage);
    formData.append("CourseDescription", courseModel.courseDescription);
    formData.append("IntroductionVideo", introductionVideo);
    formData.append("Image", image);
    formData.append("ImageUrl", courseModel.imageUrl);
    formData.append("CategoryId", courseModel.categoryId);

    const courseUpdateModel = {
      courseId: courseId,
      formData: formData,
    };
    setIsActiveButton(false);

    await handleUpdateCourse(courseUpdateModel).then((response) => {
      if (response.data.isSuccess) {
        setImage(null);
        setIsActiveButton(true);
        setIntroductionVideo(null);
        toast.success(response.data.messages[0]);
        dispatch(instructorApi.util.invalidateTags(["instructor"]));
        handleClose();
      } else {
        setIsActiveButton(true);

        toast.error(response.data.errorMessages[0]);
      }
    });
  };



  const handleSubmit = () => {
      if (bankStateInfo != "update") {
        var formData = new FormData();
        formData.append("InstructorName",bankInfo.InstructorName);
        formData.append("InstructorSurname",bankInfo.InstructorSurname);
        formData.append("IdentityNumber",bankInfo.IdentityNumber);
        formData.append("Address",bankInfo.Address);
        formData.append("Iban",bankInfo.Iban);
        formData.append("BankName",bankInfo.BankName);
        formData.append("InstructorBankDetailId",bankInfo.InstructorBankDetailId);


        addBankInfo(
          formData,
        /* Generate or set this appropriately */
        )
          .then((response) => {
            if (response.data.isSuccess) {
              toast.success('Bank information saved successfully!');
              setDisableDom(false);

              handleModalClose();
            } else {
              toast.error(response.data.message);
            }
          });
      }
      else {


        var formData = new FormData();
        formData.append("InstructorSubId",user.InstructorSubId)
        formData.append("InstructorName",bankInfo.InstructorName);
        formData.append("InstructorSurname",bankInfo.InstructorSurname);
        formData.append("IdentityNumber",bankInfo.IdentityNumber);
        formData.append("Address",bankInfo.Address);
        formData.append("Iban",bankInfo.Iban);
        formData.append("BankName",bankInfo.BankName);
        formData.append("InstructorBankDetailId",bankInfo.InstructorBankDetailId);
        formData.append("Email",userEmail);


        instructorUpdate(
          formData,
        )
          .then((response) => {
            if (response.data.isSuccess) {
              toast.success('Bank information saved successfully!');
              setDisableDom(false);

              handleModalClose();
            } else {
              toast.error(response.data.message);
            }
          });
      }
   
  };




  const handleImageChange = (e) => {
    const file = e.target.files[0];

    var fileResult = file.type.split("/");

    if (fileResult[0] != "image") {
      alert("You must choosen only image");
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          if (img.width > 4170 && img.height > 2867) {
            toast.error("Image dimension so high. Max dimension is 1170x867");
          } else {
            setImage(file);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  const { t, i18n } = useTranslation();

  return (
    <Fragment>
      <Navbar />
      <div className="" id="disableId" style={{
          pointerEvents: disableDom? "none":"auto",
          opacity: disableDom? 0.5: ""}} >
      <PageTitle pageTitle={"Instructor"} pagesub={"Instructor"} />
      <div style={{ textAlign: "right" }}>
      <div>
      <Button
        onClick={() => { checkUserBankDetail(); handleOpen(); }}
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {t("Create New Course")}
      </Button>

      <Button
        onClick={handleOpenCourseModal}
        style={redButtonStyle}
      >
        {t("Remove Course")}
      </Button>

      <Button
        onClick={openManuelBankInfoModal}
        style={greenButtonStyle}
      >
        {t("Bank Detail")}
      </Button>
    </div>
    <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={{
    ...style,
    p: 4,
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    maxWidth: '600px',
    margin: '0 auto',
    position: 'relative',
    maxHeight: '80vh', // Modal yüksekliğini sınırla
    overflowY: 'auto'  // Uzun içerikler için dikey kaydırma
  }}>
    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
      {isUpdateProcess ? t("Update Course") : t("Create Course")}
    </Typography>

    <div className="col" style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
      <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
        <Input
          type="text"
          placeholder={t("Course Name")}
          value={courseModel.courseName || ""}
          onChange={(e) =>
            setCourseModel({
              ...courseModel,
              courseName: e.target.value,
            })
          }
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
      </div>

      <span style={{
        fontWeight: '600',
        fontSize: '18px',
        color: '#333',
        display: 'inline-block',
        marginBottom: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderBottom: '2px solid #4CAF50',
        paddingBottom: '5px'
      }}>
        {t("Course Price - The amount of money must be entered in Turkish lira")}
      </span>
      <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
        <Input
          type="number"
          placeholder={t("Course Price")}
          value={courseModel.isFree ? 0 : courseModel.coursePrice || 0} // Fiyat sıfır ve disable olur, eğer Ücretsiz seçildiyse
          onChange={(e) =>
            setCourseModel({
              ...courseModel,
              coursePrice: e.target.value,
            })
          }
          disabled={courseModel.isFree} // Eğer Ücretsiz seçildiyse disable olacak
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Yeni "Is Free" alanı eklendi */}
      <div className="row" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label style={{
          fontWeight: '600',
          fontSize: '18px',
          color: '#333',
          display: 'inline-block',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          borderBottom: '2px solid #4CAF50',
          paddingBottom: '5px'
        }}>
          {t("Is this course free?")}
        </label>
        <input
          type="checkbox"
          checked={courseModel.isFree}
          onChange={(e) => {
            console.log("trigger target checked",e.target.checked)
            const value = e.target.checked;
            // isFree durumunu güncelle
            if (value) {
              setCourseModel({ ...courseModel, coursePrice: 0 ,isFree:true}); // Ücretsiz seçildiyse fiyatı sıfırla
            }
            else {
              setCourseModel({ ...courseModel ,isFree:false}); // Ücretsiz seçildiyse fiyatı sıfırla

            }
          }}
          style={{ padding: '10px' }}
        />
      </div>

      <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
        <select
          onChange={(e) =>
            setCourseModel({
              ...courseModel,
              courseLanguage: e.target.value,
            })
          }
          placeholder={t("Course Language")}
          title="languages"
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        >
          <option value="" disabled selected>
            {t("Course Language")}
          </option>
          {Languages.map((language, index) => (
            <option key={language[index]} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
        <Input
          type="text"
          placeholder={t("Course Description")}
          value={courseModel.courseDescription || ""}
          onChange={(e) =>
            setCourseModel({
              ...courseModel,
              courseDescription: e.target.value,
            })
          }
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
      </div>

      <div className="row" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{
          fontWeight: '600',
          fontSize: '18px',
          color: '#333',
          display: 'inline-block',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          borderBottom: '2px solid #4CAF50',
          paddingBottom: '5px'
        }}>
          Introduction Video
        </span>

        {courseModel.introductionVideo ? (
          <video src={courseModel.introductionVideo} controls style={{ width: '100%', borderRadius: '10px' }}></video>
        ) : (
          <p>No video uploaded</p>
        )}
        <Input
          type="file"
          placeholder={t("Introduction Video")}
          onChange={(e) => setIntroductionVideo(e.target.files[0])}
        />
      </div>

      <div className="row" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{
          fontWeight: '600',
          fontSize: '18px',
          color: '#333',
          display: 'inline-block',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          borderBottom: '2px solid #4CAF50',
          paddingBottom: '5px'
        }}>
          {t("Course Image")}
        </span>
        {courseModel.courseImage ? (
          <img src={courseModel.courseImage} alt="Course" style={{ width: '100%', borderRadius: '10px' }} />
        ) : (
          <p>No image uploaded</p>
        )}
        <Input
          type="file"
          placeholder={t("Image")}
          onChange={handleImageChange}
        />
      </div>

      <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
        <Input
          type="text"
          placeholder={t("Image Url (Optional)")}
          onChange={(e) =>
            setCourseModel({
              ...courseModel,
              imageUrl: e.target.value,
            })
          }
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
      </div>

      <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
        <select
          onChange={(e) =>
            setCourseModel({
              ...courseModel,
              categoryId: e.target.value,
            })
          }
          placeholder={t("Choose Category")}
          title="categories"
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        >
          <option value="" disabled selected>
            {t("Choose Category")}
          </option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>
    </div>

    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      {!isUpdateProcess ? (
        <Button 
          disabled={!isActiveButton} 
          onClick={createCourse} 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2, width: '100%' }}
        >
          {t("Save Course")}
        </Button>
      ) : (
        <Button 
          disabled={!isActiveButton} 
          onClick={updateCourse} 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2, width: '100%' }}
        >
          {t("Update Course")}
        </Button>
      )}
    </Typography>

    {!isActiveButton && <Spinner animation="border" sx={{ marginTop: '10px', textAlign: 'center' }} />}
  </Box>
</Modal>


  <BankInfoModal
        open={openBankInfoModal}
        onClose={handleModalClose}
        bankInfo={bankInfo}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        type={bankStateInfo}
      />
        <Modal
          open={openCourseModal}
          onClose={handleCloseCourseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <Container>
                <Row>
                  {courses.map((course, key) => (
                    <Col style={{ marginTop: "6px" }} key={course.courseId}>
                      {course.courseName} -
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveCourse(course.courseId)}
                      >
                        Remove This Course
                      </button>
                    </Col>
                  ))}
                </Row>
              </Container>
            </Typography>
          </Box>
        </Modal>
      </div>
      <CourseSectionS3
        courses={courses}
        component={"instructor"}
        onData={handleGetCourse}
      />
      <div className="pagination-wrapper">
        <ul className="pg-pagination">
          {filter.pageIndex != 1 ? (
            <li>
              <Button
                color="secondary"
                aria-label="Previous"
                onClick={() =>
                  handleClickChangePageNumber(filter.pageIndex - 1)
                }
              >
                <i className="fi ti-angle-left"></i>
              </Button>
            </li>
          ) : (
            ""
          )}

          {
            [...Array(pageCounter)].map((_, index) => (
              <li key={index} className={index === 0 ? "active" : ""}>
                <li className="active">
                  <Button
                    color="secondary"
                    onClick={() => handleClickChangePageNumber(index + 1)}
                  >
                    {index + 1}
                  </Button>
                </li>
              </li>
            ))

            //
          }
          {filter.pageIndex != pageCounter ? (
            <li>
              <Button
                color="secondary"
                aria-label="Next"
                onClick={() =>
                  handleClickChangePageNumber(filter.pageIndex + 1)
                }
              >
                <i className="fi ti-angle-right"></i>
              </Button>
            </li>
          ) : (
            ""
          )}
        </ul> 
      </div>
      </div>
      <Footer />
      <Scrollbar />
    </Fragment>
  );
}

export default InstructorAuth(InstructorDetail);
