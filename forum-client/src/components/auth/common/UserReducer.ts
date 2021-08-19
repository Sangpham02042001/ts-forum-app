const userReducer = (state: any, action: any) => {
  switch (action.type) {
    case "userName":
      return {
        ...state, userName: action.payload
      }
    case "password":
      return {
        ...state, password: action.payload
      }
    case "passswordConfirm":
      return {
        ...state, passwordConfirm: action.payload
      }
    case "email":
      return {
        ...state, email: action.payload
      }
    case "resultMsg":
      return {
        ...state, resultMsg: action.payload
      }
    case "isSubmitDisabled":
      return {
        ...state, isSubmitDisabled: action.payload
      }
    default: {
      return {
        ...state, resultMsg: 'A failure has occured'
      }
    }
  }
}

export default userReducer;