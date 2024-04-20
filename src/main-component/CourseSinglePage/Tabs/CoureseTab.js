import React, { useEffect, useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Overview from './Overview';
import Curriculum from './Curriculum';
import Instructor from './Instructor';
import Review from './Review';
import { useGetSectionsByCourseIdQuery } from '../../../api/courseApi';
import IsLoading from '../../../components/Loading/IsLoading';



const CoureseTab = ({ EventsDetails,CoursesDetails }) => {

  const {data,isLoading} = useGetSectionsByCourseIdQuery(CoursesDetails.courseId)



  const [activeTab, setActiveTab] = useState('1');
  const [sections,setSections] = useState([]);
  const [user,setUser] = useState();

  useEffect(()=>{
    if (data) {
     
    setSections(data.result.sections)
    setUser(data.result.user)
    }
  },[isLoading])


  if (isLoading) {
    return (
      <IsLoading></IsLoading>
    )
  }

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);

  }

  return (
    <div>
      <div className="wpo-course-details-tab">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { toggle('1'); }}
            >
              Overview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >

              Curriculum
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={() => { toggle('3'); }}
            >

              instructor
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '4' })}
              onClick={() => { toggle('4'); }}
            >

              reviews
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <div className="wpo-course-details-text">
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Overview />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Curriculum sections={sections}/>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <Instructor user={user} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <Col sm="12">
                <Review />
              </Col>
            </Row>
          </TabPane>

        </TabContent>
      </div>
    </div>
  );
}

export default CoureseTab;