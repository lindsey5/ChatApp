export const formatDateTime = (date) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  const formatted = new Date(date).toLocaleString('en-US', options);
  const [month, day, yearAndTime] = formatted.split('/');
  const [year, time] = yearAndTime.split(', ');
  return `${year}-${month}-${day} (${time.replace(' ', '')})`;
}

export const maskEmail = (email) => {
    const [name, domain] = email.split('@');
    if (name.length <= 3) return email; // if the name part is too short, no need to mask
    const maskedName = name.slice(0, 3) + '....';
    return `${maskedName}@${domain}`;
}