export const LEARN_KEY = 'LEARN';
export const ABOUT_KEY = 'ABOUT';
export const GET_INVOLVED_KEY = 'GET_INVOLVED';
export const ADMIN_ROLE_KEY = 'ADMIN';
export const STUDENT_ROLE_KEY = 'STUDENT';
export const VOLUNTEER_ROLE_KEY = 'VOLUNTEER';
export const PARTNER_ROLE_KEY = 'PARTNER';
export const ROLE_KEYS = [ADMIN_ROLE_KEY, STUDENT_ROLE_KEY, VOLUNTEER_ROLE_KEY, PARTNER_ROLE_KEY];

export const MENU_ITEMS = {
  [LEARN_KEY]: {
    msgKey: LEARN_KEY,
  },
  [ABOUT_KEY]: {
    msgKey: ABOUT_KEY,
  },
  [GET_INVOLVED_KEY]: {
    msgKey: GET_INVOLVED_KEY,
  },
  [ADMIN_ROLE_KEY]: {
    msgKey: ADMIN_ROLE_KEY,
  },
  [STUDENT_ROLE_KEY]: {
    msgKey: STUDENT_ROLE_KEY,
  },
  [VOLUNTEER_ROLE_KEY]: {
    msgKey: VOLUNTEER_ROLE_KEY,
  },
  [PARTNER_ROLE_KEY]: {
    msgKey: PARTNER_ROLE_KEY,
  },
};

// Mapping from menu item keys to the MSG string keys for their text
//     For now we'll use the identity (e.g., MENU_MSG_KEY_MAP.ABOUT = 'ABOUT'),
//     but this map will allow flexibility if we wanted to change the MSG key
//     to say HEADER_ABOUT, reserving the ABOUT MSG key for 'about' appearing
//     in a paragraph.
export const MENU_MSG_KEY_MAP = {
  [LEARN_KEY]: LEARN_KEY,
  [ABOUT_KEY]: ABOUT_KEY,
  [GET_INVOLVED_KEY]: GET_INVOLVED_KEY,
  // Learn: 'LEARN',
  // About: 'ABOUT',
  // GetInvolved: 'GET_INVOLVED',
};

export const PUBLIC_MENU_KEYS = [LEARN_KEY, ABOUT_KEY, GET_INVOLVED_KEY];
// export const PUBLIC_MENU_KEYS = ["LEARN", "ABOUT", "GET_INVOLVED"];
