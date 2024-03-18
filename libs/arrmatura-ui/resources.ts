import styles from "./styles";

export default {
  config: {
    persistence: "local",
    itemLabelFields: "status",
  },
  strings: {
    add_a_new_item: "Add a new item",
    app_install_title: "Launching the app",
    app_install_subtitle: "installing...",
    app_install_update: "Update app",
    app_sign_in: "Sign in",
    app_sign_up: "Create a new account",
    app_load_user_profile: "User sign in...",
    app_load_user_profile_subtitle: "Loading user information",

    ok: "OK",
    cancel: "Cancel",
    continue: "Continue",
  },
  styles,

  defaults: {
    newItem: { subject: "subject", description: "" },
  },
  forms: {
    newItem: [
      { id: "subject", name: "Subject", required: true },
      { id: "description", name: "Description", type: 'textarea' },
    ],
    item: [
      { id: "subject", name: "Subject", required: true },
      { id: "description", name: "Description", type: 'textarea' },
    ],
    itemColumns: [
      { id: "subject", name: "Subject" },
      { id: "description", name: "Description" },
    ],
    userProfile: [
      { id: "email", name: "Email", required: true },
      { id: "name", name: "Name", type: 'text' },
    ],
    viewMode: [
      { id: "table", name: "Table" },
      { id: "list", name: "List" },
      { id: "pivot", name: "Pivot" },
    ],
    signIn: [
      { id: "email", name: "User email" },
      { id: "password", name: "Password", type: "password" },
    ],
    signUp: [
      { id: "email", name: "Email" },
      { id: "username", name: "User name" },
      { id: "password", name: "Password", type: "password" },
      { id: "password2", name: "Retype Password", type: "password" },
    ],
  },
}