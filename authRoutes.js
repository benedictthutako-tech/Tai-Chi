const express = require('express');
const User = require('./userModel');
const LoginLog = require('./loginLogModel');
const router = express.Router();

// Helper function to get user's IP address
function getUserIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.socket.remoteAddress ||
         'Unknown';
}

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find user and include password field (select: false by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // Log failed login attempt
      const failedLog = new LoginLog({
        email: email,
        username: 'Unknown',
        userId: null,
        ipAddress: getUserIP(req),
        userAgent: req.headers['user-agent'],
        status: 'failed',
        failureReason: 'User not found'
      });
      await failedLog.save();

      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Log failed login attempt
      const failedLog = new LoginLog({
        userId: user._id,
        username: user.username,
        email: user.email,
        ipAddress: getUserIP(req),
        userAgent: req.headers['user-agent'],
        status: 'failed',
        failureReason: 'Invalid password'
      });
      await failedLog.save();

      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Log successful login
    const successLog = new LoginLog({
      userId: user._id,
      username: user.username,
      email: user.email,
      ipAddress: getUserIP(req),
      userAgent: req.headers['user-agent'],
      status: 'success'
    });
    await successLog.save();

    // Create session/token (you can use JWT or sessions)
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.loginLogId = successLog._id;

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    if (req.session.loginLogId) {
      // Update the login log with logout time
      await LoginLog.findByIdAndUpdate(
        req.session.loginLogId,
        { logoutTime: new Date() }
      );
    }

    req.session.destroy();
    res.json({ 
      success: true, 
      message: 'Logout successful' 
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during logout' 
    });
  }
});

// Get all login logs (Admin only)
router.get('/admin/logs', async (req, res) => {
  try {
    // Add authentication check here (verify if user is admin)
    const logs = await LoginLog.find()
      .populate('userId', 'username email')
      .sort({ loginTime: -1 })
      .limit(100);

    res.json({
      success: true,
      logs: logs
    });

  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching logs' 
    });
  }
});

// Get login logs for specific user (Admin)
router.get('/admin/user-logs/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await LoginLog.find({ userId })
      .sort({ loginTime: -1 });

    res.json({
      success: true,
      logs: logs
    });

  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user logs' 
    });
  }
});

module.exports = router;
