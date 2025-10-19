export const validateInput = (field, value) => {
  switch (field) {
    case 'username':
      if (!value) return 'Username is required';
      if (value.length < 3) return 'Username must be at least 3 characters long';
      if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
      return '';
    case 'email':
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
      return '';
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters long';
      return '';
    default:
      return '';
  }
};
