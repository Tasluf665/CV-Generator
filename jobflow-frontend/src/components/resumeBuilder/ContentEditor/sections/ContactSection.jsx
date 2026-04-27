import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import { 
  selectContactInfo, 
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateContact, 
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';
import styles from './ContactSection.module.css';

const ContactSection = () => {
  const dispatch = useDispatch();
  const contact = useSelector(selectContactInfo);
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'contact'));
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(contact);

  const handleToggle = () => {
    dispatch(toggleSection('contact'));
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setFormData(contact);
    if (!isExpanded) {
      dispatch(toggleSection('contact'));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    dispatch(updateContact(formData));
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field) => {
    const currentVisible = contact.visibleFields || [];
    let nextVisible;
    if (currentVisible.includes(field)) {
      nextVisible = currentVisible.filter(f => f !== field);
    } else {
      nextVisible = [...currentVisible, field];
    }
    dispatch(updateContact({ visibleFields: nextVisible }));
  };

  const CheckIcon = ({ field, checked }) => (
    <div 
      className={`${styles.clickableCheck} ${checked ? styles.checkedIcon : styles.uncheckedIcon}`}
      onClick={(e) => {
        e.stopPropagation();
        toggleVisibility(field);
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        {checked && <polyline points="9 11 12 14 22 4" />}
      </svg>
    </div>
  );

  const isVisible = (field) => (contact.visibleFields || []).includes(field);

  const icon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  return (
    <SectionCard
      title="Contact Information"
      icon={icon}
      isExpanded={isExpanded}
      onToggle={handleToggle}
      onEdit={!isEditing ? handleEditClick : undefined}
    >
      {isEditing ? (
        <div className={styles.editForm}>
          <div className={styles.editMode}>
            <div className={styles.editGroup}>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>First Name</label>
                  <input 
                    className={styles.input} 
                    name="firstName" 
                    value={formData.firstName || ''} 
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input 
                    className={styles.input} 
                    name="lastName" 
                    value={formData.lastName || ''} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Pronouns</label>
                  <input 
                    className={styles.input} 
                    name="pronouns" 
                    value={formData.pronouns || ''} 
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.editGroup}>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email</label>
                  <input 
                    className={styles.input} 
                    name="email" 
                    value={formData.email || ''} 
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input 
                    className={styles.input} 
                    name="phone" 
                    value={formData.phone || ''} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>LinkedIn</label>
                  <input 
                    className={styles.input} 
                    name="linkedin" 
                    value={formData.linkedin || ''} 
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Twitter / X</label>
                  <input 
                    className={styles.input} 
                    name="twitter" 
                    value={formData.twitter || ''} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Address</label>
                  <input 
                    className={styles.input} 
                    name="address" 
                    value={formData.address || ''} 
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>City</label>
                  <input 
                    className={styles.input} 
                    name="city" 
                    value={formData.city || ''} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>State</label>
                  <input 
                    className={styles.input} 
                    name="state" 
                    value={formData.state || ''} 
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Website</label>
                  <input 
                    className={styles.input} 
                    name="website" 
                    value={formData.website || ''} 
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Save to All Resumes
              </label>
              <div className={styles.actions}>
                <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.viewMode}>
          <div className={styles.viewRowDivider} />
          <div className={styles.viewGrid}>
            {(contact.firstName || contact.lastName || contact.pronouns) && (
              <>
                {contact.firstName && (
                  <div className={styles.infoItem}>
                    <CheckIcon field="firstName" checked={isVisible('firstName')} /> 
                    {contact.firstName.toUpperCase()}
                  </div>
                )}
                {contact.lastName && (
                  <div className={styles.infoItem}>
                    <CheckIcon field="lastName" checked={isVisible('lastName')} /> 
                    {contact.lastName.toUpperCase()}
                  </div>
                )}
                {contact.pronouns && (
                  <div className={styles.infoItem}>
                    <CheckIcon field="pronouns" checked={isVisible('pronouns')} /> 
                    ({contact.pronouns})
                  </div>
                )}
              </>
            )}
          </div>
          
          {(contact.email || contact.phone || contact.linkedin) && (
            <>
              <div className={styles.viewRowDivider} />
              <div className={styles.viewGrid}>
                {contact.email && (
                  <div className={styles.infoItem}>
                    <CheckIcon field="email" checked={isVisible('email')} /> 
                    {contact.email}
                  </div>
                )}
                {contact.phone && (
                  <div className={styles.infoItem}>
                    <CheckIcon field="phone" checked={isVisible('phone')} /> 
                    {contact.phone}
                  </div>
                )}
                {contact.linkedin && (
                  <div className={styles.infoItem}>
                    <CheckIcon field="linkedin" checked={isVisible('linkedin')} /> 
                    {contact.linkedin}
                  </div>
                )}
              </div>
            </>
          )}

          {(contact.city || contact.state || contact.address || contact.website || contact.twitter) && (
            <>
              <div className={styles.viewRowDivider} />
              <div className={styles.viewGrid}>
                {(contact.city || contact.state || contact.address) && (
                  <div className={styles.infoItem}>
                    <CheckIcon field="address" checked={isVisible('address')} /> 
                    {[contact.address, contact.city, contact.state].filter(Boolean).join(', ')}
                  </div>
                )}
                {contact.website && (
                  <div className={styles.infoItem}>
                    <CheckIcon field="website" checked={isVisible('website')} /> 
                    {contact.website}
                  </div>
                )}
                {contact.twitter && (
                  <div className={styles.infoItem}>
                    <CheckIcon field="twitter" checked={isVisible('twitter')} /> 
                    {contact.twitter}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </SectionCard>
  );
};

export default ContactSection;
