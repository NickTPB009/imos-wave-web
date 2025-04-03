export const formatDate = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString('en-GB', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
  };