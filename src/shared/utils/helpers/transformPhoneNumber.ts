export const transformPhoneNumber = (phoneNumber: string) => {
  let phoneRegex = /^\+?(\d{1,3})?[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$/;
  let match = phoneNumber.match(phoneRegex);

  if (match) {
    return `${match[1]}${match[2]}${match[3]}${match[4]}${match[5]}`;
  } else {
    return null;
  }
};
