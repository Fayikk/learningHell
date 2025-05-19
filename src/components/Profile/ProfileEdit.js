import React, { useState, useRef, useEffect } from 'react';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../../api/accountApi';
import './ProfileEdit.css';
import { toast } from 'react-toastify';
import Navbar from '../Navbar/Navbar';
import { useSelector } from 'react-redux';
import Footer from '../footer/Footer';

function ProfileEdit() {
      const nameIdentifier = useSelector((state) => state.authStore.nameIdentifier);
  const { data, isLoading, isError, refetch } = useGetUserProfileQuery(nameIdentifier);
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    description: '',
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef();

  // Orijinal verileri saklamak için yeni bir state ekle
  const [originalForm, setOriginalForm] = useState(null);

  useEffect(() => {
    if (data && data.result) {
      const initialForm = {
        fullName: data.result.fullName || '',
        userName: data.result.userName || '',
        email: data.result.email || '',
        phoneNumber: data.result.phoneNumber || '',
        description: data.result.description || '',
        profileImage: null,
      };
      setForm(initialForm);
      setOriginalForm(initialForm); // Orijinal verileri sakla
      setPreviewImage(data.result.profileImageUrl ? `https://localhost:7042${data.result.profileImageUrl}` : null);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, profileImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const isFormChanged = () => {
    if (!originalForm) return false;
    // profileImage hariç diğer alanları karşılaştır
    return (
      form.fullName !== originalForm.fullName ||
      form.userName !== originalForm.userName ||
      form.email !== originalForm.email ||
      form.phoneNumber !== originalForm.phoneNumber ||
      form.description !== originalForm.description ||
      form.profileImage !== null // yeni resim seçildiyse değişiklik var
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.userName || !form.email) {
      toast.error('Ad Soyad, Kullanıcı Adı ve E-posta zorunludur.');
      return;
    }
    if (form.phoneNumber && !/^05\d{9}$/.test(form.phoneNumber)) {
      toast.error('Telefon numarası 05 ile başlamalı ve 11 haneli olmalı.');
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Geçerli bir e-posta adresi giriniz.');
      return;
    }

    if (!isFormChanged()) {
      toast.info('Herhangi bir değişiklik yapmadınız.');
      return;
    }

    const formData = new FormData();
    formData.append('FullName', form.fullName);
    formData.append('UserName', form.userName);
    formData.append('Email', form.email); // <-- burada değişiklik
    formData.append('PhoneNumber', form.phoneNumber);
    formData.append('Description', form.description);
    if (form.profileImage) {
      formData.append('ProfileImage', form.profileImage);
    }
    try {
      const res = await updateUserProfile(formData).unwrap();
      if (res.isSuccess) {
        toast.success('Profil başarıyla güncellendi!');
        setEditMode(false);
        refetch();
      } else {
        toast.error('Profil güncellenemedi.');
      }
    } catch (err) {
      toast.error('Bir hata oluştu.');
    }
  };

  // Düzenle butonuna basınca formu güncel verilerle doldur
  const handleEdit = () => {
    if (data && data.result) {
      const currentForm = {
        fullName: data.result.fullName || '',
        userName: data.result.userName || '',
        email: data.result.email || '',
        phoneNumber: data.result.phoneNumber || '',
        description: data.result.description || '',
        profileImage: null,
      };
      setForm(currentForm);
      setOriginalForm(currentForm);
      setPreviewImage(data.result.profileImageUrl ? `https://localhost:7042${data.result.profileImageUrl}` : null);
    }
    setEditMode(true);
  };

  // İptal butonuna basınca formu orijinal haline döndür
  const handleCancel = () => {
    if (originalForm) {
      setForm(originalForm);
      setPreviewImage(data.result && data.result.profileImageUrl ? `https://localhost:7042${data.result.profileImageUrl}` : null);
    }
    setEditMode(false);
  };

  if (isLoading) return <div className="profile-edit-loading">Yükleniyor...</div>;
  if (isError || !data || !data.result) return(
    <>
   <Navbar />
     <div className="profile-edit-error">Kullanıcı bulunamadı.</div>
    <Footer></Footer>
</>
  )
  return (
    <>
    <Navbar />
    <div className="profile-edit-container">
      <h2>Profilim</h2>
      <div className="profile-edit-card">
        <div className="profile-edit-image-section">
          <img
            src={previewImage || '/default-profile.png'}
            alt="Profil"
            className="profile-edit-image"
            onClick={() => editMode && fileInputRef.current.click()}
            style={{ cursor: editMode ? 'pointer' : 'default' }}
          />
          {editMode && (
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          )}
        </div>
        <form className="profile-edit-form" onSubmit={handleSubmit}>
          <div className="profile-edit-row">
            <label>Ad Soyad</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </div>
          <div className="profile-edit-row">
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </div>
          <div className="profile-edit-row">
            <label>E-posta</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </div>
          <div className="profile-edit-row">
            <label>Telefon</label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="05XXXXXXXXX"
            />
          </div>
          <div className="profile-edit-row">
            <label>Açıklama</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={!editMode}
              rows={3}
              placeholder="Kendiniz hakkında kısa bir açıklama yazabilirsiniz."
            />
          </div>
          <div className="profile-edit-actions">
            {editMode ? (
              <>
                <button type="submit" className="profile-edit-save" disabled={isUpdating}>Kaydet</button>
                <button type="button" className="profile-edit-cancel" onClick={handleCancel}>İptal</button>
              </>
            ) : (
              <button type="button" className="profile-edit-edit" onClick={handleEdit}>Düzenle</button>
            )}
          </div>
        </form>
      </div>
    </div>
  <Footer></Footer>
  </>
  );
}

export default ProfileEdit;
