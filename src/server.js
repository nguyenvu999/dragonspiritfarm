const express = require('express');
const axios = require('axios');
const app = express();

// Middleware để parse JSON requests
app.use(express.json());

// API endpoint để nhận dữ liệu từ WebApp Telegram
app.post('/telegram-webhook', async (req, res) => {
  try {
    const { message } = req.body;

    if (message && message.text === '/start') {
      const user = message.from;

      // Lấy thông tin người dùng từ Telegram
      console.log('User Data:', user);

      // Gửi dữ liệu đến WebApp (Frontend)
      const webAppUrl = 'https://yourdomain.com/launch-app';
      // Bạn có thể gửi URL với thông tin người dùng
      res.redirect(webAppUrl + '?userId=' + user.id);  // Đưa userId vào URL nếu cần
    }

    res.send('OK');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error occurred' });
  }
});

// Port và bắt đầu server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
