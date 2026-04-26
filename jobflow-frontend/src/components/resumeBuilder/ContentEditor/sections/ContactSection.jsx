import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Input from '../../../common/Input/Input';
import { 
  selectContactInfo, 
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateContact, 
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';

const ContactSection = () => {
  const dispatch = useDispatch();
  const contact = useSelector(selectContactInfo);
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'contact'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateContact({ [name]: value }));
  };

  const icon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  return (
    <SectionCard
      title="Contact Info"
      icon={icon}
      isExpanded={isExpanded}
      onToggle={() => dispatch(toggleSection('contact'))}
    >
      <Input
        label="Full Name"
        name="fullName"
        value={contact.fullName}
        onChange={handleChange}
        placeholder="e.g. John Doe"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input
          label="Email"
          name="email"
          value={contact.email}
          onChange={handleChange}
          placeholder="e.g. john@example.com"
        />
        <Input
          label="Phone"
          name="phone"
          value={contact.phone}
          onChange={handleChange}
          placeholder="e.g. +1 234 567 890"
        />
      </div>
      <Input
        label="Location"
        name="location"
        value={contact.location}
        onChange={handleChange}
        placeholder="e.g. New York, NY"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input
          label="LinkedIn"
          name="linkedin"
          value={contact.linkedin}
          onChange={handleChange}
          placeholder="linkedin.com/in/username"
        />
        <Input
          label="Website/Portfolio"
          name="website"
          value={contact.website}
          onChange={handleChange}
          placeholder="yourwebsite.com"
        />
      </div>
    </SectionCard>
  );
};

export default ContactSection;
