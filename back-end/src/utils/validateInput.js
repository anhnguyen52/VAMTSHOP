const validateEmail = (email) => {
    if (!/[\w.-]+@[\w.-]+\.\w+/.test(email)) {
        return "Email không hợp lệ!";
    }
    return null;
};

const validatePassword = (password) => {
    if (password.length < 8) {
        return "Mật khẩu phải chứa ít nhất 8 ký tự!";
    }
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Mật khẩu phải có ít nhất 1 chữ hoa, chữ thường, số và ký tự đặc biệt!",
      });
    }
    return null;
};

const validateUtils = {
    validateEmail,
    validatePassword
};
module.exports = validateUtils;