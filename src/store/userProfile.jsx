import { observable } from 'mobx';

export const userProfile = observable({
  userProfile: {
    first_name: '',
    last_name: '',
    nick_name: '',
    email: '',
    phone: '',
    gender: '',
    age: '',
    country: '',
    city: '',
  },

  setUserProfile(data) {
    this.userProfile = {...this.userProfile, ...data};
  }
});
