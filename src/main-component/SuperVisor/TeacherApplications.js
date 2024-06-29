import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Footer from '../../components/footer/Footer';
import PageTitle from '../../components/pagetitle/PageTitle';
import TeamSection from '../../components/TeamSection/TeamSection';
import { useGetInstructiveApplicantsMutation } from '../../api/becomeTeacherApi';

function TeacherApplications() {

    const [getApplicants] = useGetInstructiveApplicantsMutation();

    const [filter,setFilter] = useState({
        filterProperty:"",
        filterValue:"",
        pageSize:6,
        pageNumber:1
    })

    const [applicants,setApplicants] = useState();

    useEffect( ()=>{

        async function getApplicantsAsync()
        {
            await getApplicants({filter}).then((response) => {
                setApplicants(response.data.result.data)
            })
        }

      getApplicantsAsync()


    },[])

   


  return (
    <Fragment>
    <Navbar />
    <PageTitle pageTitle={'Supervisor'} pagesub={'Instructive Applications'} />
    <TeamSection pbClass={'pb-big'} applicants={applicants} title={"Instructive Applicants"}/>
    <Footer />
      <Scrollbar />
    </Fragment>
  )
}

export default TeacherApplications