import { observable } from 'mobx';

export const isUserLogin = observable({
  isUserLogin: false,

  setUserLogin() {
    this.isUserLogin = true;
  },

  setUserLogout() {
    this.isUserLogin = false;
  }
});
