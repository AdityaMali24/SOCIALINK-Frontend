import React from 'react'
import ProfileTabs from './ProfileTabs'
import UserEditProfile from './UserEditProfile'
const ViewProfile = () => {
  return (
    <div>
      <UserEditProfile/>
      <ProfileTabs/>
    </div>
  )
}

export default ViewProfile