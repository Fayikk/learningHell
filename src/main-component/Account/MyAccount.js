import React, { Fragment } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Footer from '../../components/footer/Footer'
import { useTranslation } from 'react-i18next'
function MyAccount() {
  const {t} = useTranslation();
  return (
    <>
    <Fragment>
            <Navbar />
            <PageTitle pageTitle={t('My Account')} pagesub={t('My Account')} />
            <div className='text-center' >
            <span><strong>{t("This Page Is Under Maintainance")}</strong></span>
            </div>
            <Footer />
        </Fragment>
            </>
  )
}

export default MyAccount