export const USER_PROFILE_SET_TYPE = "USER_PROFILE_SET"

export interface UserProfilePayload {
  id: string
  userName: string
}

export interface UserProfileAction {
  type: string
  payload: UserProfilePayload | null
}

export const UserProfileReducer = (
  state: any = null,
  action: UserProfileAction
): UserProfilePayload | null => {
  switch (action.type) {
    case USER_PROFILE_SET_TYPE:
      return action.payload;
    default:
      return state;
  }
}