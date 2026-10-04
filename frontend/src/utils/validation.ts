export type ValidationErrors = Record<string, string>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;

const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

const UNIVERSITY_ID_REGEX = /^[A-Za-z0-9][A-Za-z0-9._-]{2,29}$/;

const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;

const PASSWORD_LOWERCASE_REGEX = /[a-z]/;

const PASSWORD_NUMBER_REGEX = /[0-9]/;

const OTP_REGEX = /^\d{6}$/;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export const trimValue = (value: string): string => {
  return value.trim();
};

export const validateName = (
  value: string,
  fieldName: string
): string => {
  const trimmed = value.trim();

  if (!trimmed) {
    return `${fieldName} is required.`;
  }

  if (trimmed.length < 2) {
    return `${fieldName} must contain at least 2 characters.`;
  }

  if (trimmed.length > 50) {
    return `${fieldName} cannot exceed 50 characters.`;
  }

  if (!NAME_REGEX.test(trimmed)) {
    return `${fieldName} can contain only letters, spaces, apostrophes, periods, and hyphens.`;
  }

  return '';
};

export const validateEmail = (value: string): string => {
  const email = value.trim();

  if (!email) {
    return 'Email address is required.';
  }

  if (email.length > 254) {
    return 'Email address is too long.';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'Enter a valid email address, for example student@university.edu.';
  }

  return '';
};

export const validatePassword = (
  value: string,
  fieldName = 'Password'
): string => {
  if (!value) {
    return `${fieldName} is required.`;
  }

  if (value.length < 8) {
    return `${fieldName} must be at least 8 characters long.`;
  }

  if (value.length > 72) {
    return `${fieldName} cannot exceed 72 characters.`;
  }

  if (!PASSWORD_UPPERCASE_REGEX.test(value)) {
    return `${fieldName} must contain at least one uppercase letter.`;
  }

  if (!PASSWORD_LOWERCASE_REGEX.test(value)) {
    return `${fieldName} must contain at least one lowercase letter.`;
  }

  if (!PASSWORD_NUMBER_REGEX.test(value)) {
    return `${fieldName} must contain at least one number.`;
  }

  return '';
};

export const validatePhone = (value: string): string => {
  const phone = value.trim();

  if (!phone) {
    return '';
  }

  if (!PHONE_REGEX.test(phone)) {
    return 'Enter a valid phone number containing 10 to 15 digits.';
  }

  return '';
};

export const validateUniversityId = (value: string): string => {
  const universityId = value.trim();

  if (!universityId) {
    return 'University ID is required.';
  }

  if (!UNIVERSITY_ID_REGEX.test(universityId)) {
    return 'University ID must contain 3–30 letters, numbers, dots, hyphens, or underscores.';
  }

  return '';
};

export const validateOtp = (value: string): string => {
  const otp = value.trim();

  if (!otp) {
    return 'OTP code is required.';
  }

  if (!OTP_REGEX.test(otp)) {
    return 'OTP must contain exactly 6 digits.';
  }

  return '';
};

export const validateRequired = (
  value: string,
  fieldName: string
): string => {
  if (!value.trim()) {
    return `${fieldName} is required.`;
  }

  return '';
};

export const validateDate = (
  value: string,
  fieldName: string,
  allowFuture = false
): string => {
  if (!value) {
    return `${fieldName} is required.`;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return `Enter a valid ${fieldName.toLowerCase()}.`;
  }

  if (!allowFuture) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date > today) {
      return `${fieldName} cannot be in the future.`;
    }
  }

  return '';
};

export const validateImageFiles = (
  files: File[]
): string => {
  if (files.length === 0) {
    return '';
  }

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      return `"${file.name}" is not a valid image file.`;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return `"${file.name}" exceeds the 10 MB image size limit.`;
    }
  }

  return '';
};

export const validateRegistrationForm = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  universityId: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  const firstNameError = validateName(data.firstName, 'First name');
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateName(data.lastName, 'Last name');
  if (lastNameError) errors.lastName = lastNameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const universityIdError = validateUniversityId(data.universityId);
  if (universityIdError) errors.universityId = universityIdError;

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

export const validateProfileForm = (data: {
  firstName: string;
  lastName: string;
  phone: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  const firstNameError = validateName(data.firstName, 'First name');
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateName(data.lastName, 'Last name');
  if (lastNameError) errors.lastName = lastNameError;

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;

  return errors;
};

export const hasValidationErrors = (
  errors: ValidationErrors
): boolean => {
  return Object.keys(errors).length > 0;
};