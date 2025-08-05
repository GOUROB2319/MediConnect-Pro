import translate from 'google-translate-api';

export const translateToBangla = async (text) => {
  try {
    const res = await translate(text, { to: 'bn' });
    return res.text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on failure
  }
};

export const sendBanglaNotification = async (user, messageType, data) => {
  const templates = {
    appointment: `আপনার অ্যাপয়েন্টমেন্ট ${data.date} তারিখে ${data.time} সময় নির্ধারিত হয়েছে`,
    medicine: `আপনার ওষুধ ${data.medicineName} খাওয়ার সময় হয়েছে`,
    emergency: `জরুরী অবস্থা! ${user.name} সাহায্য চাইছেন`
  };
  
  const englishMessage = templates[messageType];
  const banglaMessage = await translateToBangla(englishMessage);
  
  // Send via SMS/email
  sendSMS(user.phone, banglaMessage);
};