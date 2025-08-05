import twilio from 'twilio';

// Twilio client setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Predefined Bangla messages
const banglaMessages = {
  appointment: "আপনার ডাক্তারের অ্যাপয়েন্টমেন্ট {date} তারিখে {time} সময়ে নির্ধারিত হয়েছে",
  medicine: "আপনার ওষুধ {medicineName} খাওয়ার সময় হয়েছে",
  emergency: "জরুরী অবস্থা! {userName} সাহায্য চাইছেন"
};

// Send notification via SMS/Email
export const sendNotification = async (to, subject, message, isBangla = false) => {
  try {
    // For Bangla messages, use predefined templates
    if (isBangla) {
      // In a real app, we would replace placeholders with actual values
      console.log(`Sending Bangla notification to ${to}: ${message}`);
      
      // Uncomment to actually send SMS
      /*
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });
      */
      return;
    }
    
    console.log(`Sending notification to ${to}: ${subject} - ${message}`);
    
    // In a real app, we would send an email here
    // This is just a simulation
    
  } catch (error) {
    console.error('Notification error:', error);
  }
};

// Get Bangla message by type
export const getBanglaMessage = (type, data) => {
  let message = banglaMessages[type];
  
  if (!message) return "জরুরী বিজ্ঞপ্তি";
  
  // Replace placeholders with actual data
  message = message.replace('{date}', data.date || '')
                   .replace('{time}', data.time || '')
                   .replace('{medicineName}', data.medicineName || '')
                   .replace('{userName}', data.userName || '');
  
  return message;
};